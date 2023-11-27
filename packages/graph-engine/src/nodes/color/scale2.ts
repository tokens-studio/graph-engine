import { NodeDefinition, NodeTypes } from "../../types.js";
import { scaleGenerator } from "./lib/colorScale.js";

export const type = NodeTypes.SCALE2;

export type State = {
  color: string;
  backgroundColor: string;
  steps: number;
  distribution: "lightness" | "contrast";
  min: number;
  max: number;
  wcag: WcagVersion;
};
export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0"
}
export const defaults: State = {
  color: "#FFFFFF",
  backgroundColor: "#000000",
  steps: 10,
  distribution: "lightness",
  min: 0,
  max: 100, // Default max value based on WCAG version
  wcag: WcagVersion.V3
};

export type Input = {
  color: string;
} & State;

export const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const steps = final.steps
  const {scale, closestStepIndex} = scaleGenerator({
    baseColor: final.color,
    steps,
    min: final.min,
    max: final.max,
  })

  return {scale, closestStepIndex}
};

export const mapOutput = (input, state, processed) => {
  const array = processed.scale.map((x, i) => {
    return {
      name: "" + i,
      value: x,
      type: "color",
    };
  });

  return processed.scale.reduce(
    (acc, color, i) => {
      acc[i] = color;
      return acc;
    },
    {
      array,
      closestStepIndex: processed.closestStepIndex
    }
  );
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
  mapOutput,
};
