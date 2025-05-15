import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DownloadCloudIcon, RefreshCwIcon, RotateCcw } from "lucide-react";
import React from "react";

interface ActionBarProps {
  isLoading: boolean;
  file: File | null;
  svgContent: string | null;
  settingsChanged: boolean;
  clearFile: () => void;
  convertToSvg: () => void;
  showCopyToast: (success: boolean, error?: unknown) => void;
}

export function ActionBar({
  isLoading,
  file,
  svgContent,
  settingsChanged,
  clearFile,
  convertToSvg,
  showCopyToast,
}: ActionBarProps) {
  return (
    <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="flex flex-row gap-4 bg-white/90 shadow-xl rounded-2xl px-8 py-5 border border-gray-200 items-center pointer-events-auto max-w-fit">
        <Button
          className={cn(
            "px-6 py-3 font-semibold text-base transition-all duration-150",
            isLoading || !file ? "opacity-50 cursor-not-allowed" : ""
          )}
          onClick={clearFile}
          disabled={isLoading || !file}
          variant="outline"
          aria-label="Reset uploaded image and settings"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </span>
        </Button>
        <Button
          className={cn(
            "px-6 py-3 font-semibold text-base transition-all duration-150",
            !file || isLoading || (!settingsChanged && !!svgContent)
              ? "opacity-50 cursor-not-allowed"
              : ""
          )}
          onClick={convertToSvg}
          disabled={!file || isLoading || (!settingsChanged && !!svgContent)}
          aria-busy={isLoading}
          aria-label="Convert PNG to SVG"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                <path d="M4 12a8 8 0 018-8" />
              </svg>
              Converting...
            </span>
          ) : svgContent && settingsChanged ? (
            <span className="flex items-center gap-2">
              <RefreshCwIcon />
              Update SVG
            </span>
          ) : svgContent ? (
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              SVG Up-to-date
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              Convert to SVG
            </span>
          )}
        </Button>
        {svgContent && file && (
          <>
            <a
              href={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
              download={`${file.name.split(".").slice(0, -1).join(".")}.svg`}
              className={cn(
                "px-6 py-3 text-white rounded-lg font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 border-r-transparent focus:ring-blue-400 border border-blue-200 min-w-[140px] text-center bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 flex items-center gap-2",
                isLoading ? "opacity-50 pointer-events-none" : ""
              )}
              tabIndex={isLoading ? -1 : 0}
              aria-disabled={isLoading}
              aria-label="Download SVG file"
            >
              <DownloadCloudIcon className="h-4 w-4" />
              Download SVG
            </a>
            <Button
              className={cn(
                "px-6 py-3 font-semibold text-base transition-all duration-150 flex items-center gap-2",
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              )}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(svgContent);
                  showCopyToast(true);
                } catch (err) {
                  showCopyToast(false, err);
                }
              }}
              disabled={isLoading}
              variant="outline"
              aria-label="Copy SVG code to clipboard"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <rect x="3" y="3" width="13" height="13" rx="2" />
              </svg>
              Copy SVG
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
