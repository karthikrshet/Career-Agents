// apps/web/src/lib/pdf/types.ts

export interface PdfMetadata {
  info: Record<string, any>;
  metadata: any;
  fingerprints: any;
  outline: any;
  permission: any;
  totalPages: number;
}
