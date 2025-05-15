"use server";

import ImageTracer from "imagetracerjs";
import { createCanvas, loadImage } from "canvas";

export const convertToSvgServer = async (
  file: File,
  settings: {
    ltres: number;
    colorsampling: number;
    numberofcolors: number;
    strokewidth: number;
    linefilter: number;
  }
): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const imageUrl = `data:${file.type};base64,${base64}`;

  const img = await loadImage(imageUrl);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const svgString = ImageTracer.imagedataToSVG(imageData, settings);
  return svgString;
};
