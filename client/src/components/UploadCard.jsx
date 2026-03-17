import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "../lib/utils";

function UploadCard({
  file,
  onFileSelect,
  jobDescription,
  onJobDescriptionChange,
}) {
  const [uploadError, setUploadError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop(acceptedFiles) {
      setUploadError("");
      onFileSelect(acceptedFiles[0] || null);
    },
    onDropRejected() {
      setUploadError("Please upload a single PDF file (max 5 MB).");
      onFileSelect(null);
    },
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Badge className="w-fit" variant="outline">
          Upload
        </Badge>
        <CardTitle className="text-2xl">Drop your resume PDF</CardTitle>
        <CardDescription>
          Drag and drop a PDF or click to browse. Add a job description to get
          role-specific matching insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          {...getRootProps()}
          className={cn(
            "group cursor-pointer rounded-2xl border border-dashed border-border bg-secondary/70 p-6 text-center transition hover:border-primary/60 hover:bg-accent/60",
            isDragActive && "border-primary bg-accent",
          )}
        >
          <input {...getInputProps()} />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            {isDragActive ? "Drop the PDF here" : "Drag & drop your PDF here"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Supports one PDF file up to 5 MB
          </p>
        </div>

        {uploadError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {uploadError}
          </p>
        ) : null}

        {file ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">
            Target job description
          </span>
          <textarea
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            rows={9}
            placeholder="Paste the job description to compare required skills, keywords, and fit."
            className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
      </CardContent>
    </Card>
  );
}

export default UploadCard;
