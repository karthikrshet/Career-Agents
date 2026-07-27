// apps/web/src/lib/pdf/browser.ts

export async function preview(file: File): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }
  return URL.createObjectURL(file);
}

export async function render(file: File): Promise<any | null> {
  if (typeof window === "undefined") {
    return null;
  }
  // Browser preview render stub
  return null;
}
