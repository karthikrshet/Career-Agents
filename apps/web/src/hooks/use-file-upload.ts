// apps/web/src/hooks/use-file-upload.ts
import { useState } from "react";
import { toast } from "sonner";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string; // text or base64 data URL
  rawFile: File;
}

const ALLOWED_EXTENSIONS = [
  "pdf", "docx", "doc", "txt", "md", "csv", "xlsx", "xls", "pptx", "ppt", "json", "zip",
  "png", "jpeg", "jpg", "gif", "svg", "py", "java", "cpp", "h", "go", "rs", "js", "jsx",
  "ts", "tsx", "html", "css", "xml", "yaml", "yml", "dockerfile", "json"
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`File extension .${ext} is not supported.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File "${file.name}" exceeds the 10MB size limit.`);
      return false;
    }
    return true;
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const ext = file.name.split(".").pop()?.toLowerCase();

      // Read images as Base64 data URL, text files as text
      const isBinary = ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "zip", "png", "jpeg", "jpg", "gif", "svg"].includes(ext || "");

      reader.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          content: reader.result as string,
          rawFile: file,
        });
      };

      reader.onerror = () => {
        reject(new Error("File reading failed"));
      };

      if (isBinary) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const uploadFiles = async (fileList: FileList | File[]): Promise<UploadedFile[]> => {
    setUploading(true);
    const validFiles: File[] = [];
    const arr = Array.from(fileList);

    for (const f of arr) {
      if (validateFile(f)) {
        validFiles.push(f);
      }
    }

    try {
      const processed = await Promise.all(validFiles.map(processFile));
      setFiles((prev) => [...prev, ...processed]);
      return processed;
    } catch (err) {
      toast.error("Failed to parse files.");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return {
    files,
    uploading,
    uploadFiles,
    removeFile,
    clearFiles,
  };
}
