// packages/brain/knowledge.ts

export interface DocumentChunk {
  id: string;
  documentName: string;
  sourceType: string;
  content: string;
  pageNumber?: number;
}

// In-memory simple vector-like database for server runtime
let documentStore: DocumentChunk[] = [];

export function indexDocument(name: string, type: string, content: string): void {
  // Simple paragraph chunker
  const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  
  paragraphs.forEach((p, idx) => {
    documentStore.push({
      id: `doc-${Date.now()}-${idx}`,
      documentName: name,
      sourceType: type,
      content: p.slice(0, 1000), // cap chunk size to 1kb
      pageNumber: Math.floor(idx / 3) + 1,
    });
  });
}

export function searchKnowledgeBase(query: string, limit: number = 3): DocumentChunk[] {
  const lq = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (lq.length === 0 || documentStore.length === 0) return [];

  // Scored BM25-like search
  const scored = documentStore.map(chunk => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    
    lq.forEach(word => {
      if (contentLower.includes(word)) {
        score += 1;
        // Boost matches on phrases or whole words
        if (new RegExp(`\\b${word}\\b`).test(contentLower)) {
          score += 2;
        }
      }
    });

    return { chunk, score };
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
}
