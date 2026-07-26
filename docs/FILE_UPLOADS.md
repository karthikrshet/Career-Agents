# Career OS — File Uploads & Parsing Engine

This document outlines the file upload capabilities, file formats, size boundaries, and internal text extraction pipelines in Career OS.

---

## Upload Capabilities

Career OS features a centralized file upload utility accessible under the Resume Studio and Copilot attachments. 

- **Maximum Upload Size:** 10MB per file.
- **Allowed Formats:** `.pdf`, `.docx`, `.doc`, `.txt`, `.md`, `.rtf`, `.odt`, `.csv`, `.json`
- **OCR Support:** Client-side fallback checks notify the user if an uploaded PDF contains only image scans (no selectable characters), recommending using plain-text inputs.

---

## File Parsing Engine

The file upload parsing is handled via the server route `/api/parse-file` (`apps/web/src/app/api/parse-file/route.ts`). Depending on the file's MIME type, different parsing modules are invoked:

### 1. Plain Text & Markdown (`.txt`, `.md`, `.csv`, `.json`)
Directly read and decoded into UTF-8 strings.
```typescript
const text = buffer.toString('utf-8');
```

### 2. PDF Documents (`.pdf`)
Parsed using client/server streams extracting text characters from individual pages while filtering out graphic layouts. The engine detects typical PDF issues like double-column grids to maintain word boundaries.

### 3. Microsoft Word Documents (`.docx`)
Extracted using paragraph-by-paragraph text matching. Word file content schemas are unpacked from XML layout files inside the docx zip archive.

### 4. Rich Text Format (`.rtf`)
Parsed using standard regex matching patterns to strip out RTF control tags (`\rtf1`, `\ansi`, `\deff`, etc.) and isolate raw text.

---

## Parse File API Route

The parsing API expects a `multipart/form-data` payload containing a file field:

```bash
curl -X POST -F "file=@/path/to/my-resume.pdf" http://localhost:3000/api/parse-file
```

### Success Response
```json
{
  "text": "John Doe\nSoftware Engineer\n...\n",
  "fileName": "my-resume.pdf",
  "fileType": "application/pdf",
  "wordCount": 456
}
```

---

## OCR Verification Flow

If the parsing engine processes a PDF and yields a word count of 0 (or a very low count relative to file size), the system triggers a warning message in the UI:

```
[Warning] Scanned Image Detected
This PDF appears to be a scanned image. Career OS cannot analyze image-only resumes.
Please upload a PDF generated from Word/Google Docs or paste the plain text directly.
```

---

## Security Mitigations

To prevent server vulnerabilities during file unpacking:
- **Zip Bomb Safeguards:** For `.docx` parsing, the file extraction limits total unzipped text size to 15MB.
- **Strict Content Verification:** Mimetypes are validated using file magic numbers instead of relying solely on the file extension.
