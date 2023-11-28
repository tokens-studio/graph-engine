import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";

export const type = NodeTypes.SCALE;

export type State = {
  stepsUp: number;
  stepsDown: number;
};

export const defaults: State = {
  stepsUp: 4,
  stepsDown: 4,
};

export type Input = {
  color: string;
} & State;

export const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const stepsUp = Math.max(0, parseInt("" + final.stepsUp)) + 2;
  const stepsDown = Math.max(0, parseInt("" + final.stepsDown)) + 2;

  const lighter = chroma
    .scale(["white", final.color])
    .mode("hsl")
    .colors(stepsUp)
    .slice(1, -1);

  const mid = [chroma(final.color).hex()];

  const darker = chroma
    .scale([final.color, "black"])
    .mode("hsl")
    .colors(stepsDown)
    .slice(1, -1);
  return ([] as string[]).concat(lighter, mid, darker) as string[];
};

export const mapOutput = (input, state, processed) => {
  const array = processed.map((x, i) => {
    return {
      name: "" + i,
      value: x,
      type: "color",
    };
  });

  return processed.reduce(
    (acc, color, i) => {
      acc[i] = color;
      return acc;
    },
    {
      array,
    }
  );
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
  mapOutput,
};
