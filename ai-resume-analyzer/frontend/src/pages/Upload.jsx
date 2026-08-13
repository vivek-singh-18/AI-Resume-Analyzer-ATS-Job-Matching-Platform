import React, { useRef, useState } from "react";
import axios from "axios";
import {
  Upload,
  File,
  CheckCircle2,
  Loader2,
  X,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FileUploader({
  className = "w-full max-w-3xl mx-auto mt-18",
  onUploadSuccess,
}) {
  const { token } = useAuthStore();
  const [files, setFiles] = useState([]);
  const [isDragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length) addFiles(Array.from(e.target.files));
  };

  const addFiles = (newFiles) => {
    const filesWithMeta = newFiles.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      status: "pending",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...filesWithMeta]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!token) return toast.error("Login required");
    if (!files.length) return toast.error("Please select file(s) to upload");

    setIsDialogOpen(true);
  };

  const handleFinalUpload = async () => {
    if (!jobDescription.trim()) {
      const confirmNoJd = window.confirm(
        "No Job Description provided.\n\nWithout a Job Description, the analysis will be generic. Would you like to continue anyway?"
      );
      if (!confirmNoJd) return;
    }

    setIsDialogOpen(false);

    for (const f of files) {
      if (f.status === "completed") continue;
      updateFile(f.id, { status: "uploading", progress: 0 });

      const formData = new FormData();
      formData.append("file", f.file);
      formData.append("jobDescription", jobDescription);

      try {
        await axios.post("http://localhost:5000/api/docs/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (e) => {
            const progress = Math.round((e.loaded * 100) / e.total);
            updateFile(f.id, { progress });
          },
        });
        updateFile(f.id, { status: "completed", progress: 100 });
        toast.success(`Uploaded: ${f.name}`);
        setTimeout(() => removeFile(f.id, true), 2000);
        if (onUploadSuccess) onUploadSuccess();
      } catch (err) {
        console.error(err);
        updateFile(f.id, { status: "error" });
        toast.error(`Failed: ${f.name}`);
      }
    }

    setJobDescription("");
  };

  const updateFile = (id, updates) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Resume Intelligence
        </CardTitle>
        <CardDescription>
          Upload resumes or documents to compare against your Job Description.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ease-in-out ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-100"
            }`}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".txt,.md,.pdf,text/plain,application/pdf"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-700">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, MD, and TXT files (Max 10MB)
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <ScrollArea className="Upload-ScrollArea max-h-30 w-full overflow-y-auto rounded-md bg-white">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 mb-2 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File
                      className={`h-8 w-8 flex-shrink-0 ${
                        file.status === "completed"
                          ? "text-green-500"
                          : file.status === "error"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className="font-medium text-sm text-slate-900 truncate max-w-[200px]"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {file.status === "uploading" && (
                      <div className="flex flex-col items-end gap-1 w-24">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {file.progress}%
                        </span>
                      </div>
                    )}

                    {file.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {file.status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Add Job Context
                </DialogTitle>
                <DialogDescription>
                  Paste the Job Description below. This helps our AI tailor the
                  analysis to your specific requirements.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <textarea
                  className="flex min-h-[150px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste Job Description here (e.g. 'Looking for a Senior React Developer with 5+ years of experience...')"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleFinalUpload}>Start Analysis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleInitialSubmit}
            className="w-full h-11 text-md font-medium shadow-md"
            disabled={files.length === 0}
          >
            {files.length > 0
              ? `Analyze ${files.length} File${files.length !== 1 ? "s" : ""}`
              : "Select Files to Begin"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
