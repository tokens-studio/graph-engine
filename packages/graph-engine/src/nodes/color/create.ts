import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";

export const type = NodeTypes.CREATE_COLOR;

export const colorSpaces = [
  "rgb",
  "hsl",
  "hsv",
  "hsi",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "hcl",
  "cmyk",
  "gl",
];

type ColorData = {
  a: string;
  b: string;
  c: string;
  d: string;
  space: string;
};

export const defaults = {
  space: "rgb",
  a: 1,
  b: 1,
  c: 1,
  d: 1,
};

const process = (input: ColorData, state) => {
  const final = {
    ...state,
    ...input,
  };

  const a = parseFloat(final.a);
  const b = parseFloat(final.b);
  const c = parseFloat(final.c);
  const d = parseFloat(final.d);

  return chroma([a, b, c, d], final.space).hex();
};

export const node: NodeDefinition<ColorData> = {
  //@ts-ignore
  colorSpaces,
  type,
  defaults,
  process,
};
