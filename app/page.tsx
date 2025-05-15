"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { convertToSvgServer } from "../actions/convert";
import { SettingsPanel } from "@/app/(components)/settings-panel";
import { ImageDropzone } from "@/app/(components)/image-dropzone";
import { SETTINGS_DESCRIPTIONS } from "@/lib/settings-descriptions";
import { ImagePreviewCompare } from "@/app/(components)/image-preview-compare";
import { toast } from "sonner";
import { ActionBar } from "@/app/(components)/action-bar";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [settings, setSettings] = useState(
    Object.fromEntries(
      Object.entries(SETTINGS_DESCRIPTIONS).map(([key, { value }]) => [
        key,
        value,
      ])
    )
  );
  const defaultSettings = Object.fromEntries(
    Object.entries(SETTINGS_DESCRIPTIONS).map(([key, { value }]) => [
      key,
      value,
    ])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  const updateSetting = (key: string, value: number) => {
    if (!isLoading) {
      const newValue = key === "numberofcolors" && value < 2 ? 2 : value;
      const newSettings = { ...settings, [key]: newValue };
      setSettings(newSettings);
      // Compare newSettings to defaultSettings and set settingsChanged accordingly
      const changed = Object.keys(defaultSettings).some(
        (k) => newSettings[k] !== defaultSettings[k]
      );
      setSettingsChanged(changed);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setSvgContent(null); // Clear the current converted image
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = reader.result as string;
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Accept pasted PNG images
  const onPasteImage = (pastedFile: File) => {
    setFile(pastedFile);
    setSvgContent(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = reader.result as string;
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(pastedFile);
  };

  const convertToSvg = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const svgString = await convertToSvgServer(file, {
        ltres: settings.ltres,
        colorsampling: settings.colorsampling,
        numberofcolors: settings.numberofcolors,
        strokewidth: settings.strokewidth,
        linefilter: settings.linefilter,
      });
      setSvgContent(svgString);
      setSettingsChanged(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while converting the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setSvgContent(null);
    setImagePreview(null);
    setImageDimensions(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"] },
  });

  // Utility function for showing SVG copy toasts
  function showCopyToast(success: boolean, error?: unknown) {
    if (success) {
      toast("Copied to your clipboard", {
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff",
          width: "fit-content",
          paddingRight: "1.5rem",
          paddingLeft: "1.5rem",
        },
      });
    } else {
      toast("Failed to copy SVG", {
        description:
          error instanceof Error
            ? error.message
            : "Could not copy SVG to clipboard.",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff",
          width: "fit-content",
        },
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 overflow-auto pb-24 h-screen">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-center text-gray-800 ml-32">
        <span className="inline-block align-middle mr-3">🖼️</span>
        PNG <span className="text-blue-600">→</span> SVG Converter
      </h1>

      {/* Responsive layout: side-by-side on desktop, stacked on mobile */}
      <div className="w-full max-w-[1400px] flex flex-col md:flex-row gap-8 items-start justify-center mt-auto mb-auto">
        {/* Left: Image dropzone and preview */}
        <div className="flex-1 w-full md:w-2/3 flex flex-col items-center">
          <ImageDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isLoading={isLoading}
            file={file}
            onPasteImage={onPasteImage}
          />

          {imagePreview && imageDimensions && (
            <ImagePreviewCompare
              imagePreview={imagePreview}
              imageDimensions={imageDimensions}
              svgContent={svgContent}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Right: Settings panel */}
        <div className="w-full md:w-[600px] flex-shrink-0">
          <SettingsPanel
            settings={settings}
            defaultSettings={SETTINGS_DESCRIPTIONS}
            isLoading={isLoading}
            updateSetting={updateSetting}
          />
        </div>
      </div>

      {/* Action Buttons - Improved UI */}
      <ActionBar
        isLoading={isLoading}
        file={file}
        svgContent={svgContent}
        settingsChanged={settingsChanged}
        clearFile={clearFile}
        convertToSvg={convertToSvg}
        showCopyToast={showCopyToast}
      />
    </div>
  );
}
