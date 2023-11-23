import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.GEOMETRIC_SERIES;

export const defaults = {
  base: 16,
  ratio: 1.5,
  stepsDown: 0,
  steps: 5,
  precision: 2,
};

type GeometricValue = {
  index: number;
  value: number;
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const values: GeometricValue[] = [];
  const shift = 10 ** final.precision;

  for (let i = 0 - final.stepsDown; i <= final.steps; i++) {
    const value = Math.round((final.base * Math.pow(final.ratio, i)) * shift) / shift;
    values.push({
      index: i,
      value
    });
  } 

  return values;
};

export const mapOutput = (input, state, processed: GeometricValue[]) => {
  const mapped = { asArray: processed };

  processed.forEach((item) => {
    mapped[item.index] = item.value;
  });
  return mapped;
};

export const node: NodeDefinition = {
  description:
    "Generates a geometric series f(n)= c * (f(n-1)) of numbers based on the base value, steps down, steps and increment.",
  defaults,
  type,
  process,
  mapOutput,
};
