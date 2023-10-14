import { Bezier } from 'bezier-js';
import Color from 'colorjs.io';

function transformArray(array) {
  if (array.length == 4 || array.length === 6) {
    if (array.length === 6) {
      return [
        { x: 0, y: array[0] },
        { x: array[2], y: array[3] },
        { x: array[4], y: array[5] },
        { x: 1, y: array[1] },
      ];
    }

    return [
      { x: 0, y: 0 },
      { x: array[0], y: array[1] },
      { x: array[2], y: array[3] },
      { x: 1, y: 1 },
    ];
  }
  throw new Error('Input array must have exactly four or six elements');
}

export function generateColorStops(
  numStops,
  baseColor,
  lightnessCurve,
  chromaCurve,
  hueCurve
) {
  const lCurve = new Bezier(transformArray(lightnessCurve));
  const cCurve = new Bezier(transformArray(chromaCurve));
  const hCurve = new Bezier(transformArray(hueCurve));
  const colorStops: string[] = [];
  for (let i = 0; i < numStops; i++) {
    const t = i / (numStops - 1);
    const baseHue = new Color(baseColor).oklch[2];
    const baseColorChroma = new Color(baseColor).oklch[1];
    const lightness = lCurve.get(t).y;
    const chroma = cCurve.get(t).y;
    const hue = hCurve.get(t).y;
    const hueNormalized = baseHue + (hue * 360) / 5;
    const chromaNormalized = chroma * baseColorChroma; // normalize chroma from 0-1 to 0-0.37

    // Use Chroma.js to set the lightness while preserving the base color
    const interpolatedColor = new Color(baseColor);
    interpolatedColor.oklch[0] = lightness; // set lightness according to curve
    interpolatedColor.oklch[1] = chromaNormalized; //set chroma according to curve
    interpolatedColor.oklch[2] = hueNormalized; //set chroma according to curve

    colorStops.push(interpolatedColor.toString({format: "lch"}));
  }
  return colorStops;
}
