# Career OS — Export Engines & Formats

This guide documents the report generation and document compilation engines in Career OS.

---

## Supported Export Formats

Career OS allows users to export dashboards, resume scores, interview evaluations, and career roadmaps in five format categories:

1. **PDF Reports** — Formal career metrics dossier compiled with `pdf-lib`.
2. **Markdown Reports** — Readable files for local notes and GitHub.
3. **HTML Reports** — Formatted web layout representations.
4. **Word Documents (`.docx`)** — Custom resume layouts built using `docx`.
5. **Excel Spreadsheets (`.xlsx`)** — Structured career roadmap files built with `exceljs`.

---

## Technical Implementations

The export modules reside in the backend utilities and are invoked via `/api/reports/generate`.

### 1. PDF Compilation (`pdf-lib`)

`pdf-lib` is used to create career reports dynamically without requiring a headless browser:
- **Geometry:** Letter/A4 grid system coordinate math.
- **Styling:** Injects branding primary blue (`#4F46E5`), text dark grey (`#1F2937`), and metric indicators.
- **Charts:** Translates data vectors into SVG coordinate lines and points drawn onto the PDF canvas.

```typescript
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function compilePDFReport(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Write document header
  page.drawText('Career OS Personal Evaluation Report', {
    x: 50,
    y: 720,
    size: 20,
    font,
    color: rgb(0.31, 0.27, 0.9)
  });
  
  // Write metrics section...
  return pdfDoc.save();
}
```

### 2. Excel Roadmaps (`exceljs`)

Used to compile milestone sheets for career paths and job tracking:
- **Sheets:** Divided into "Career Roadmap", "Target Skills", and "Target Companies".
- **Styling:** Colors table headers and enables autofit columns.

```typescript
import ExcelJS from 'exceljs';

export async function compileXLSXRoadmap(roadmapData: any): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Career Roadmap');
  
  sheet.columns = [
    { header: 'Phase', key: 'phase', width: 10 },
    { header: 'Target Milestone', key: 'milestone', width: 35 },
    { header: 'Required Skills', key: 'skills', width: 30 },
    { header: 'Difficulty', key: 'difficulty', width: 15 }
  ];
  
  // Add values and format cells
  return workbook.xlsx.writeBuffer() as Promise<Buffer>;
}
```

### 3. Word Documents (`docx`)

Used to compile optimized resumes based on ATS template criteria:
- **Margins:** Set to 1 inch standard.
- **Hierarchy:** Implements custom paragraph styles for Headings and Bullet lists.

```typescript
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function compileDOCXResume(resumeText: string): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "ATS COMPLIANT RESUME", bold: true, size: 28 })
          ]
        })
        // Add sections...
      ]
    }]
  });
  return Packer.toBuffer(doc);
}
```

---

## Formatting Dashboard Data

When `/api/reports/generate` receives a request, the payload contains:
- `profile`: Target roles and target companies.
- `metrics`: Scores for resume, GitHub, and interview categories.
- `resumeAnalysis`: Bullet errors and missing keywords list.
- `GitHubAnalysis`: Pinned repositories and languages.

The report generator maps these metrics to the requested format and responds with the compiled file stream.
