// packages/brain/knowledge.ts
import fs from "fs";
import path from "path";
import { resolveWorkspacePath } from "./router";

export interface DocumentChunk {
  id: string;
  documentName: string;
  sourceType: string;
  content: string;
  pageNumber?: number;
  embedding?: number[];
}

let documentStore: DocumentChunk[] = [];
const storePath = resolveWorkspacePath("exports/reports/knowledge-store.json");

function saveStore(): void {
  try {
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(documentStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save knowledge store:", err);
  }
}

function loadStore(): void {
  try {
    const resolved = resolveWorkspacePath("exports/reports/knowledge-store.json");
    if (fs.existsSync(resolved)) {
      const data = fs.readFileSync(resolved, "utf-8");
      documentStore = JSON.parse(data) || [];
    }
  } catch (err) {
    console.error("Failed to load knowledge store:", err);
  }
}

// Load initially on startup
loadStore();

async function generateEmbedding(text: string): Promise<number[] | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { parts: [{ text }] } })
      });
      if (res.ok) {
        const json = await res.json();
        return json.embedding?.values || null;
      }
    } catch {}
  }
  
  if (openaiKey) {
    try {
      const url = `https://api.openai.com/v1/embeddings`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({ input: [text], model: "text-embedding-3-small" })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.[0]?.embedding || null;
      }
    } catch {}
  }
  
  return null;
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function indexDocument(name: string, type: string, content: string): Promise<void> {
  const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  
  for (let idx = 0; idx < paragraphs.length; idx++) {
    const p = paragraphs[idx].slice(0, 1000);
    const embedding = await generateEmbedding(p);
    
    documentStore.push({
      id: `doc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      documentName: name,
      sourceType: type,
      content: p,
      pageNumber: Math.floor(idx / 3) + 1,
      embedding: embedding || undefined
    });
  }
  saveStore();
}

export async function searchKnowledgeBase(query: string, limit: number = 3): Promise<DocumentChunk[]> {
  loadStore();
  
  const queryEmbedding = await generateEmbedding(query);
  const lq = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (lq.length === 0 && !queryEmbedding) return [];

  const scored = documentStore.map(chunk => {
    let bm25Score = 0;
    const contentLower = chunk.content.toLowerCase();
    
    lq.forEach(word => {
      if (contentLower.includes(word)) {
        bm25Score += 1;
        if (new RegExp(`\\b${word}\\b`).test(contentLower)) {
          bm25Score += 2;
        }
      }
    });

    let semanticScore = 0;
    if (queryEmbedding && chunk.embedding) {
      semanticScore = cosineSimilarity(queryEmbedding, chunk.embedding);
    }

    const finalScore = queryEmbedding && chunk.embedding
      ? (0.7 * semanticScore) + (0.3 * (bm25Score / 10))
      : bm25Score;

    return { chunk, score: finalScore };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}

export function formatCitations(chunks: DocumentChunk[]): string {
  if (chunks.length === 0) return "";
  let citations = "\n\n**Sources & Citations:**";
  chunks.forEach((chunk, index) => {
    citations += `\n[${index + 1}] "${chunk.documentName}" (${chunk.sourceType.toUpperCase()}), Page ${chunk.pageNumber || 1} - *"${chunk.content.slice(0, 120)}..."*`;
  });
  return citations;
}

export function clearKnowledgeBase(): void {
  documentStore = [];
  saveStore();
}
