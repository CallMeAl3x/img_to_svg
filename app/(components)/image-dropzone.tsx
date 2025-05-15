import React, { useCallback } from "react";

interface ImageDropzoneProps {
  getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isLoading: boolean;
  file: File | null;
  onPasteImage?: (file: File) => void;
}

export function ImageDropzone({
  getRootProps,
  getInputProps,
  isLoading,
  file,
  onPasteImage,
}: ImageDropzoneProps) {
  // Handle paste event for image upload
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (isLoading) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file && file.type === "image/png" && onPasteImage) {
            onPasteImage(file);
            e.preventDefault();
            break;
          }
        }
      }
    },
    [isLoading, onPasteImage]
  );

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-12 rounded-lg text-center cursor-pointer mb-6 w-full max-w-4xl ${
        isLoading ? "cursor-not-allowed opacity-50" : "hover:border-gray-500"
      }`}
      aria-disabled={isLoading}
      tabIndex={0}
      onPaste={handlePaste}
    >
      <input {...getInputProps()} disabled={isLoading} />
      <p className="text-gray-700 text-lg font-medium flex items-center justify-center gap-2">
        {file ? (
          <>
            <span className="text-green-700">Image uploaded:</span>
            <span
              className="truncate max-w-xs inline-block align-middle font-semibold"
              title={file.name}
            >
              {file.name}
            </span>
            <span className="text-gray-500 text-base font-normal">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </>
        ) : (
          <span className="text-gray-500">
            Drag & drop a PNG file here, click to select, or paste (Ctrl+V) a
            PNG image
          </span>
        )}
      </p>
    </div>
  );
}
