import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";
import extractColors from "extract-colors";

const type = NodeTypes.EXTRACT;

type inputData = {
  //Total pixel number of the resized picture for calculation
  pixels?: number;
  //From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
  distance?: number;

  saturationDistance?: number;
  lightnessDistance?: number;
  hueDistance?: number;

  // The src of the url to extract colors from
  url?: string;
};

export const defaults = {
  pixels: 60800,
  distance: 0.22,
  saturationDistance: 0.2,
  lightnessDistance: 0.2,
  hueDistance: 0.083,
};

const process = async (input: inputData, state) => {
  const final = {
    ...state,
    ...input,
  };

  //This works fine, types are broken
  //@ts-ignore
  const colors = await extractColors(final.url, {
    distance: parseFloat(final.distance),
    saturationDistance: parseFloat(final.saturationDistance),
    lightnessDistance: parseFloat(final.lightnessDistance),
    hueDistance: parseFloat(final.hueDistance),
    crossOrigin: "anonymous",
  });

  colors.forEach((color: any) => {
    const labColor = chroma.rgb(color.red, color.green, color.blue).lab();
    color.perceptualSaturation = Math.sqrt(labColor[1] ** 2 + labColor[2] ** 2);
  });
  colors.sort((colorA: any, colorB: any) => {
    if (colorB.perceptualSaturation === colorA.perceptualSaturation) {
      return colorB.area - colorA.area;
    }
    return colorB.perceptualSaturation - colorA.perceptualSaturation;
  });

  return colors;
};

const mapOutput = (input: inputData, state, processed) => {
  const returning = {
    asArray: processed.map((x) => x.hex),
    raw: processed,
  };
  processed.forEach((color, index) => {
    returning[`color-${index}`] = color.hex;
  });

  return returning;
};

export const node: NodeDefinition<inputData> = {
  type,
  mapOutput,
  defaults,
  process,
};
