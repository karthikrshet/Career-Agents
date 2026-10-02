import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

console.log('=== STARTING KNOWLEDGE BASE INDEXING TESTS ===');

// knowledge.ts is TypeScript compiled by the web app; build it with the web app's compiler
// so these tests run the real indexing and search code.
let ts;
try {
  ts = require(path.join(root, 'apps', 'web', 'node_modules', 'typescript'));
} catch {
  throw new Error('TypeScript not found: run `npm install` in apps/web before this test');
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-index-'));
const libDir = path.join(workDir, 'lib');
fs.mkdirSync(libDir);
fs.copyFileSync(
  path.join(root, 'packages', 'brain', 'keyword-score.js'),
  path.join(libDir, 'keyword-score.js')
);
for (const name of ['knowledge', 'router']) {
  const source = fs.readFileSync(path.join(root, 'packages', 'brain', `${name}.ts`), 'utf8')
    .replace(/import\.meta\.url/g, "require('url').pathToFileURL(__filename).href");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
  });
  fs.writeFileSync(path.join(libDir, `${name}.js`), outputText);
}

// Each scenario gets its own workspace: the store lives at <cwd>/exports/reports/knowledge-store.json.
function freshWorkspace(label) {
  const dir = path.join(workDir, label);
  fs.mkdirSync(dir);
  process.chdir(dir);
  return path.join(dir, 'exports', 'reports', 'knowledge-store.json');
}

// A new module instance starts with whatever store is on disk, like a fresh server process.
function loadKnowledge() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(libDir)) delete require.cache[key];
  }
  return require(path.join(libDir, 'knowledge.js'));
}

const readStore = storePath => JSON.parse(fs.readFileSync(storePath, 'utf8'));
const realFetch = globalThis.fetch;
const savedKeys = { GEMINI_API_KEY: process.env.GEMINI_API_KEY, OPENAI_API_KEY: process.env.OPENAI_API_KEY };

// Deterministic stand-in for the embeddings API that records which texts were embedded.
let embedded = [];
function useStubEmbeddings() {
  delete process.env.GEMINI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  globalThis.fetch = async (url, options) => {
    const text = JSON.parse(options.body).input[0];
    embedded.push(text);
    const vector = Array(26).fill(0);
    for (const ch of text.toLowerCase()) {
      const i = ch.charCodeAt(0) - 97;
      if (i >= 0 && i < 26) vector[i] += 1;
    }
    return { ok: true, json: async () => ({ data: [{ embedding: vector }] }) };
  };
}
function useKeywordSearchOnly() {
  delete process.env.GEMINI_API_KEY;
  delete process.env.OPENAI_API_KEY;
}

const resume = [
  'Senior backend engineer with Kubernetes and Go experience.',
  'Led migration of the payments platform to an event-driven architecture.',
  'Mentored six engineers and owned on-call reliability.'
].join('\n\n');

async function testSameDocumentTwice() {
  console.log('Testing that indexing the same document twice does not duplicate its chunks...');
  const storePath = freshWorkspace('same-document');
  useStubEmbeddings();
  const kb = loadKnowledge();

  embedded = [];
  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  const first = readStore(storePath);
  assert.strictEqual(first.length, 3);
  assert.strictEqual(embedded.length, 3, 'each new paragraph is embedded once');

  embedded = [];
  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  const second = readStore(storePath);
  assert.deepStrictEqual(second, first, 'the stored chunks are unchanged by the repeated upload');
  assert.strictEqual(new Set(second.map(c => c.content)).size, second.length, 'no paragraph is stored twice');
  assert.deepStrictEqual(embedded, [], 'already indexed paragraphs are not embedded again');
  console.log('[PASS] Re-indexing an identical document adds no chunks and no embedding calls.');
}

async function testEditedDocument() {
  console.log('Testing that an edited re-upload keeps existing chunks and adds only changed paragraphs...');
  const storePath = freshWorkspace('edited-document');
  useStubEmbeddings();
  const kb = loadKnowledge();

  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  const before = readStore(storePath);
  const edited = resume.replace('Mentored six engineers', 'Mentored ten engineers');
  embedded = [];
  await kb.indexDocument('resume.pdf', 'application/pdf', edited);
  const after = readStore(storePath);

  assert.deepStrictEqual(after.slice(0, 3), before, 'existing chunks are kept unchanged');
  assert.deepStrictEqual(after.slice(3).map(c => c.content), ['Mentored ten engineers and owned on-call reliability.'], 'only the changed paragraph is added');
  assert.deepStrictEqual(embedded, ['Mentored ten engineers and owned on-call reliability.']);
  assert.strictEqual(after[3].pageNumber, 1, 'the added chunk keeps its position-based page number');
  console.log('[PASS] Edited re-uploads keep old chunks and add only the new paragraph.');
}

async function testDifferentDocumentNames() {
  console.log('Testing that identical text under different document names is kept for each document...');
  const storePath = freshWorkspace('different-names');
  useStubEmbeddings();
  const kb = loadKnowledge();

  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  await kb.indexDocument('resume-copy.pdf', 'application/pdf', resume);
  const store = readStore(storePath);
  assert.strictEqual(store.length, 6);
  assert.deepStrictEqual([...new Set(store.map(c => c.documentName))], ['resume.pdf', 'resume-copy.pdf']);
  console.log('[PASS] Documents with different names are not merged.');
}

async function testSearchAfterRepeatedUpload() {
  console.log('Testing that a repeated upload does not take several search result slots...');
  freshWorkspace('search');
  useKeywordSearchOnly();
  const kb = loadKnowledge();

  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  await kb.indexDocument('resume.pdf', 'application/pdf', resume);
  await kb.indexDocument('designer.md', 'text/markdown', 'Product designer for onboarding flows.\n\nSome Kubernetes exposure from platform work.');

  const results = await kb.searchKnowledgeBase('kubernetes', 3);
  assert.strictEqual(new Set(results.map(c => c.content)).size, results.length, 'no paragraph is returned twice');
  assert.ok(results.some(c => c.documentName === 'designer.md'), 'other matching documents are not pushed out of the results');
  console.log('[PASS] Search results are not filled with copies of the same paragraph.');
}

async function testLatestStoreIsUsed() {
  console.log('Testing that indexing keeps chunks written to the store after this instance loaded it...');
  const storePath = freshWorkspace('latest-store');
  useKeywordSearchOnly();
  const first = loadKnowledge();   // loads the (empty) store
  const second = loadKnowledge();  // another instance, e.g. a separate server process

  await second.indexDocument('cover-letter.md', 'text/markdown', 'Cover letter for the platform team.');
  await first.indexDocument('resume.pdf', 'application/pdf', resume);
  assert.deepStrictEqual([...new Set(readStore(storePath).map(c => c.documentName))], ['cover-letter.md', 'resume.pdf'],
    'chunks saved by the other instance are preserved');
  console.log('[PASS] Indexing starts from the stored chunks rather than a stale in-memory copy.');
}

const originalCwd = process.cwd();
try {
  await testSameDocumentTwice();
  await testEditedDocument();
  await testDifferentDocumentNames();
  await testSearchAfterRepeatedUpload();
  await testLatestStoreIsUsed();
  console.log('=== ALL KNOWLEDGE BASE INDEXING TESTS PASSED ===');
} finally {
  process.chdir(originalCwd);
  globalThis.fetch = realFetch;
  for (const [key, value] of Object.entries(savedKeys)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  fs.rmSync(workDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}
