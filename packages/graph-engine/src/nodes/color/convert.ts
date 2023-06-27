/**
 * @packageDocumentation
 * Converts a color from one color space to another and exposes the channels as outputs
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import { Rgb, Lab, Hsl, converter } from "culori";

export const type = NodeTypes.CONVERT_COLOR;

export const colorSpaces = [
  "rgb",
  "hsl",
  "lab",
  "oklab",

  //RGB like
  "a98",
  "p3",
  "prophoto",
  "rec2020",

  //LAB like

  "dlab",
  "lab65",

  //HSL like
  "okhsl",
  "cubehelix",
];

type ColorData = {
  color: string;
  /**
   * Target color space
   */
  space: string;
};

export const defaults = {
  space: "rgb",
};

const validateInputs = (input: ColorData, state: ColorData) => {
  const final = {
    ...state,
    ...input,
  };
  if (!colorSpaces.includes(final.space)) {
    throw new Error("Invalid color space");
  }
};

const process = (input: ColorData, state) => {
  const final = {
    ...state,
    ...input,
  };

  const convert = converter(final.space);

  const output = convert(final.color);

  switch (final.space) {
    case "a98":
    case "p3":
    case "prophoto":
    case "rec2020":
    case "rgb": {
      const col: Rgb = output as unknown as Rgb;
      return {
        a: col.r,
        b: col.g,
        c: col.b,
        d: col.alpha,
        channels: [col.r, col.g, col.b, col.alpha],
        labels: ["r", "g", "b", "alpha"],
      };
    }
    case "cubehelix":
    case "hsl":
    case "okhsl": {
      const col: Hsl = output as unknown as Hsl;
      return {
        a: col.h,
        b: col.s,
        c: col.l,
        d: col.alpha,
        channels: [col.h, col.s, col.l, col.alpha],
        labels: ["h", "s", "l", "alpha"],
      };
    }

    case "oklab":
    case "lab65":
    case "dlab":
    case "lab": {
      const col: Lab = output as unknown as Lab;
      return {
        a: col.l,
        b: col.a,
        c: col.b,
        d: col.alpha,
        channels: [col.l, col.a, col.b, col.alpha],
        labels: ["l", "a", "b", "alpha"],
      };
    }
  }

  return output;
};

const mapOutput = (input, state, processed) => {
  return processed;
};

export const node: NodeDefinition<ColorData, ColorData> = {
  //@ts-ignore
  colorSpaces,
  validateInputs,
  mapOutput,
  type,
  defaults,
  process,
};
