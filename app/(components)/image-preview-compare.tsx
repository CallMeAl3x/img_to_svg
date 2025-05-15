import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Compare } from "./compare";
import { cn } from "@/lib/utils";

interface ImagePreviewCompareProps {
  imagePreview: string;
  imageDimensions: { width: number; height: number };
  svgContent: string | null;
  isLoading: boolean;
}

export function ImagePreviewCompare({
  imagePreview,
  imageDimensions,
  svgContent,
  isLoading,
}: ImagePreviewCompareProps) {
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const minZoom = 1;
  const maxZoom = 4;
  const zoomStep = 0.2;

  const maxDim = 500;
  const { width, height } = imageDimensions;
  let displayWidth = width;
  let displayHeight = height;
  // Enforce a minimum of 200px for width/height when converted
  if (svgContent) {
    displayWidth = Math.max(displayWidth, 200);
    displayHeight = Math.max(displayHeight, 200);
  }
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    displayWidth = Math.round(width * scale);
    displayHeight = Math.round(height * scale);
    // Enforce minimum after scaling
    if (svgContent) {
      displayWidth = Math.max(displayWidth, 200);
      displayHeight = Math.max(displayHeight, 200);
    }
  }

  // Handle wheel zoom in modal
  function handleModalWheel(e: React.WheelEvent) {
    if (!showModal) return;
    e.preventDefault();
    setZoom((z) => {
      let next = z - e.deltaY * 0.001;
      next = Math.max(minZoom, Math.min(maxZoom, next));
      return Math.round(next * 100) / 100;
    });
  }

  return (
    <>
      <div className="relative max-w-4xl mb-6">
        <h2 className="text-xl font-semibold mb-4 w-full">
          {svgContent && (
            <div className="flex w-full justify-between">
              <p>Before</p> <p>After</p>
            </div>
          )}
        </h2>
        <div
          className={cn("relative group", svgContent && "cursor-zoom-in")}
          style={{
            width: displayWidth,
            height: displayHeight,
            aspectRatio: `${width} / ${height}`,
            maxWidth: maxDim,
            maxHeight: maxDim,
          }}
          onClick={() => svgContent && setShowModal(true)}
          tabIndex={0}
          {...(svgContent ? { "aria-label": "Zoom image" } : {})}
        >
          {/* Show only the image preview if not loading and not converted */}
          {!svgContent && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="w-full h-full object-contain rounded-lg"
                style={{ aspectRatio: `${width} / ${height}` }}
              />
              {/* Overlay spinner if loading */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </>
          )}
          {/* Show Compare only after conversion is done */}
          {svgContent && (
            <>
              <Compare
                firstImage={imagePreview}
                secondImage={`data:image/svg+xml;utf8,${encodeURIComponent(
                  svgContent || ""
                )}`}
                className="w-full h-full object-contain rounded-lg"
                slideMode="hover"
                showHandlebar={true}
              />
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg flex items-center justify-center px-4"
            style={{
              width: "70vw",
              height: "70vh",
              maxWidth: "80vw",
              maxHeight: "80vh",
              aspectRatio: `${width} / ${height}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom})`,
                transition: "transform 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!svgContent ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Zoomed preview"
                    className="w-full h-full object-contain rounded-lg"
                    style={{ aspectRatio: `${width} / ${height}` }}
                  />
                </>
              ) : (
                <Compare
                  firstImage={imagePreview}
                  secondImage={`data:image/svg+xml;utf8,${encodeURIComponent(
                    svgContent || ""
                  )}`}
                  className="w-full h-full object-contain rounded-lg"
                  slideMode="hover"
                  showHandlebar={true}
                />
              )}
            </div>
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg px-3 py-1 shadow flex items-center">
              <button
                className="text-lg px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                onClick={() =>
                  setZoom((z) =>
                    Math.max(minZoom, Math.round((z - zoomStep) * 100) / 100)
                  )
                }
                disabled={zoom <= minZoom}
                aria-label="Zoom out"
                type="button"
              >
                -
              </button>
              <span className="px-2 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                className="text-lg px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                onClick={() =>
                  setZoom((z) =>
                    Math.min(maxZoom, Math.round((z + zoomStep) * 100) / 100)
                  )
                }
                disabled={zoom >= maxZoom}
                aria-label="Zoom in"
                type="button"
              >
                +
              </button>
            </div>
            <button
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-black/90"
              onClick={() => setShowModal(false)}
              aria-label="Close zoom"
              type="button"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
