export const colorSpaces = [
  "a98rgb",
  "acescc",
  "acescg",
  // "cam16",
  "hct",
  "hpluv",
  "hsl",
  "hsluv",
  "hsv",
  "hwb",
  "ictcp",
  "jzazbz",
  "jzczhz",
  "lab-d65",
  "lab",
  "lch",
  "lchuv",
  "luv",
  // "okhsl",
  // "okhsv",
  "oklab",
  "oklch",
  "p3-linear",
  "p3",
  "prophoto-linear",
  "prophoto",
  "rec2020-linear",
  "rec2020",
  // "rec2100-hlg",
  // "rec2100-pq",
  "srgb-linear",
  "srgb",
  "xyz-abs-d65",
  "xyz-d50",
  "xyz-d65"
] as const;


export type ColorSpace = typeof colorSpaces[number];
