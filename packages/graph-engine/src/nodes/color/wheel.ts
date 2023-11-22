import { NodeDefinition, NodeTypes } from "@/types.js";
import chroma from "chroma-js";

export const type = NodeTypes.WHEEL;

export type State = {
  hueAmount: number;
  hueAngle: number;
  saturation: number;
  lightness: number;
  colors: number;
};

export const defaults: State = {
  hueAmount: 360,
  hueAngle: 180,
  saturation: 80,
  lightness: 50,
  colors: 8,
};

type colorValue = {
  index: number;
  value: string;
};

export type Input = {
  hueAmount: number;
  hueAngle: number;
  saturation: number;
  lightness: number;
  colors: number;
} & State;

const validateInputs = (input: Input, state: State) => {
  if (input.colors < 0 || state.colors < 0) {
    throw new Error("Colors must be greater than 0");
  }
};

export const process = (input: Input, state: State): colorValue[] => {
  const final = {
    ...state,
    ...input,
  };

  const colorList: colorValue[] = [];

  let step;
  for (step = 0; step < final.colors; step++) {
    const hue =
      (parseFloat(final.hueAngle as any) +
        (step * parseFloat(final.hueAmount as any)) /
          parseInt(final.colors as any)) %
      360;
    const color = chroma.hsl(hue, final.saturation, final.lightness);
    colorList.push({
      index: step,
      value: color.hex(),
    });
  }

  return colorList;
};

export const mapOutput = (input, state, processed: colorValue[]) => {
  const mapped = { asArray: processed };

  processed.forEach((item) => {
    mapped[item.index] = item.value;
  });
  return mapped;
};

export const node: NodeDefinition<Input, State, colorValue[]> = {
  description:
    "Generate Color Wheel node allows you to create a color scale based on a base color and rotation in hue. You can use this node to generate a color scale for a specific color property.",
  type,
  validateInputs,
  defaults,
  process,
  mapOutput,
};
