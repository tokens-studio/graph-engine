export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const compareFunctions = {
  Contrast: (foreground, background, wcag) => {
    if (wcag == WcagVersion.V2) {
      return background.contrast(foreground, "WCAG21");
    } else {
      return Math.abs(background.contrast(foreground, "APCA"));
    }
  },
  Hue: (foreground, background) =>
    Math.abs(foreground.hsl[0] - background.hsl[0]),
  Lightness: (foreground, background) =>
    Math.abs(foreground.contrast(background, "Lstar")),
  Saturation: (foreground, background) =>
    Math.abs(foreground.hsl[1] - background.hsl[1]),
  Distance: (foreground, background) => foreground.deltaE(background, "2000"),
};
