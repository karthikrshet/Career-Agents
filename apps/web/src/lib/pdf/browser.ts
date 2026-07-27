// apps/web/src/lib/pdf/browser.ts

export async function parsePdfBrowser(file: File): Promise<string> {
  // Client-side PDF text extraction placeholder / browser APIs
  if (typeof window === "undefined") {
    return "";
  }
  
  // Return empty string or stub logic
  return "";
}
