import React, { useCallback } from "react";
import {
  DocumentIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface FileBlockProps {
  type: "Image" | "Attachment";
  data: string;
  filename: string;
  metadata?: {
    size?: string;
    uploadDate?: string;
    fileType?: string;
  };
}

export const FileBlock: React.FC<FileBlockProps> = ({
  type,
  data,
  filename,
  metadata,
}) => {
  const handleFileOpen = useCallback(() => {
    try {
      // Convert base64 to blob
      const base64Response = data.split(";base64,").pop() || "";
      const binaryString = window.atob(base64Response);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const extension = filename.split(".").pop()?.toLowerCase();
      const mimeType =
        extension === "pdf" ? "application/pdf" : `application/${extension}`;

      // Create blob and URL
      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Open in new tab
      window.open(blobUrl, "_blank");

      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  }, [data, filename]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = () => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <DocumentIcon className="size-5 text-red-400" />;
      case "doc":
      case "docx":
        return <DocumentIcon className="size-5 text-blue-400" />;
      case "txt":
        return <DocumentIcon className="size-5 text-zinc-400" />;
      case "zip":
      case "rar":
        return <ArrowDownTrayIcon className="size-5 text-yellow-400" />;
      default:
        return <DocumentIcon className="size-5 text-zinc-400" />;
    }
  };

  if (!data) {
    return (
      <div className="my-2 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-zinc-400">
        No {type.toLowerCase()} data available
      </div>
    );
  }

  if (type === "Image") {
    return (
      <div className="relative my-4 w-full max-w-3xl">
        <div className="group overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/50 transition-all hover:border-zinc-600 hover:bg-zinc-800">
          {/* Image Preview Container */}
          <div className="relative aspect-video">
            <img
              src={data}
              alt={filename}
              className="absolute inset-0 size-full object-contain"
            />
            {/* Overlay with View Full Size button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(data, "_blank");
                }}
                className="flex items-center gap-2 rounded-lg bg-zinc-900/90 px-4 py-2 text-sm text-zinc-200 shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-900"
              >
                <EyeIcon className="size-4" />
                View full size
              </button>
            </div>
          </div>
          {/* Image Info Footer */}
          <div className="flex items-center gap-3 border-t border-zinc-700/50 px-4 py-2">
            <PhotoIcon className="size-4 text-zinc-400" />
            <div className="flex flex-1 items-center gap-2 truncate">
              <span className="truncate text-sm text-zinc-300">{filename}</span>
              {metadata?.size && (
                <span className="shrink-0 text-xs text-zinc-500">
                  ({metadata.size} MB)
                </span>
              )}
            </div>
            {metadata?.uploadDate && (
              <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
                <ClockIcon className="size-3" />
                {formatDate(metadata.uploadDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 w-full max-w-2xl">
      <div
        onClick={handleFileOpen}
        className="group flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 transition-all hover:border-zinc-600 hover:bg-zinc-800"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-700/50">
          {getFileIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm text-zinc-200">{filename}</p>
            {metadata?.size && (
              <span className="text-xs text-zinc-400">
                ({metadata.size} MB)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Click to open</span>
            <span>•</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFileOpen();
              }}
              className="hover:text-zinc-200 hover:underline"
            >
              Download
            </button>
            {metadata?.uploadDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  {formatDate(metadata.uploadDate)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
