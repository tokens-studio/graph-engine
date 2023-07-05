import { NodeDefinition, NodeTypes } from "#/types.js";
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
}


export type Input = {
  hueAmount: number,
  hueAngle: number,
  saturation: number,
  lightness: number,
  colors: number,
} & State;

export const process = (input: Input, state: State): colorValue[] => {
  const final = {
    ...state,
    ...input,
  };

  const colorList: colorValue[] = [];

  let step;
  for( step = 0; step < final.colors; step++ ) {
    const hue = (parseFloat(final.hueAngle as any) + (step * parseFloat(final.hueAmount as any) / parseInt(final.colors as any))) % 360;
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
  type,
  defaults,
  process,
  mapOutput,
};
