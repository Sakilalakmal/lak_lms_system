"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RendorErrorState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { file } from "zod";

interface UploaderProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export function Uploader() {
  const [fileState, setFileState] = useState<UploaderProps>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      //get presigned url from backend
      const presignedUrlResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedUrlResponse.ok) {
        toast.error("failed to get presigned url");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedUrl, Key } = await presignedUrlResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;

            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          console.log("📤 AWS S3 Upload complete!");
          console.log("🔢 Status:", xhr.status);
          console.log("📝 Response:", xhr.responseText || "(empty)");

          if (xhr.status === 200 || xhr.status === 204) {
            console.log("✅ Upload successful to AWS S3!");
            console.log("🗝️ File Key:", Key);
            
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: Key,
            }));

            toast.success("File uploaded successfully to AWS S3!");

            resolve();
          } else {
            console.error("❌ AWS S3 Upload failed!");
            console.error("🔢 Status:", xhr.status);
            console.error("📝 Response:", xhr.responseText);
            reject(new Error(`AWS S3 upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = (error) => {
          console.error("XHR Error:", error);
          console.error("XHR Status:", xhr.status);
          console.error("XHR Response:", xhr.responseText);
          reject(new Error("Upload failed - network error"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        
        console.log("🚀 Starting AWS S3 upload...");
        console.log("📁 File name:", file.name);
        console.log("📄 File type:", file.type);
        console.log("📏 File size:", file.size, "bytes");
        console.log("🔗 Upload URL:", presignedUrl.split('?')[0]); // Hide query params for cleaner log
        
        xhr.send(file);
      });
    } catch (error) {
      toast.error("File upload failed. Please try again.");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });

      uploadFile(file);
    }
  }, []);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileTooLarge) {
        toast.error("File is too large. Maximum size is 5MB.");
      }

      if (tooManyFiles) {
        toast.error("You can only upload one file at a time.");
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return <h1>uploading....</h1>;
    }

    if (fileState.error) {
      return <RendorErrorState />;
    }

    if (fileState.objectUrl) {
      return <h1>uploaded file</h1>;
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 2 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    // 5MB
  });
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 ",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center p-4 justify-center w-full h-full">
        <input {...getInputProps()} />
        {/* <RenderEmptyState isDragActive={isDragActive} /> */}
        {renderContent()}
      </CardContent>
    </Card>
  );
}
