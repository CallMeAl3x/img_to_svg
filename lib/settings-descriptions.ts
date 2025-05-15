export const SETTINGS_DESCRIPTIONS = {
  ltres: {
    value: 1,
    recommended: 1,
    max: 10,
    min: 0,
    description:
      "Line accuracy: Lower values make lines follow the image more closely (more detail), higher values make lines straighter and simpler.",
  },
  colorsampling: {
    value: 1,
    recommended: 1,
    max: 1,
    min: 0,
    description:
      "Color mode: 0 uses the original colors, 1 reduces the number of colors to make the SVG smaller.",
  },
  numberofcolors: {
    value: 8,
    recommended: 8,
    max: 99,
    min: 2,
    description:
      "How many colors to use in the SVG. More colors look closer to the original, fewer colors look simpler (minimum: 2).",
  },
  strokewidth: {
    value: 1,
    recommended: 1,
    max: 10,
    min: 0,
    description:
      "How thick the outline lines are in the SVG. Increase for bolder lines, decrease for finer lines.",
  },
  linefilter: {
    value: 0,
    recommended: 1,
    max: 1,
    min: 0,
    description:
      "Line filter: 0 keeps all lines, 1 removes tiny or messy lines for a cleaner SVG.",
  },
};
