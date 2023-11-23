import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ARITHMETIC_SERIES;

export const defaults = {
  base: 16,
  stepsDown: 0,
  steps: 1,
  increment: 1,
  precision: 2,
};

export type ArithemeticValue = {
  index: number;
  value: number;
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const values: ArithemeticValue[] = [];
  //Fixes issue with string concatenation
  const base = parseFloat(final.base);
  const shift = 10 ** final.precision;

  for (let i = Math.abs(final.stepsDown); i > 0; i--) {
    const value = Math.round((base - final.increment * i) * shift) / shift;
    values.push({
      index: 0 - i,
      value: value,
    });
  }
  values.push({
    index: 0,
    value: Math.round(final.base * shift) / shift,
  });

  for (let i = 0; i < Math.abs(final.steps); i++) {
    const value =
      Math.round((base + final.increment * (i + 1)) * shift) / shift;
    values.push({
      index: i + 1,
      value: value,
    });
  }

  return values;
};

export const mapOutput = (input, state, processed: ArithemeticValue[]) => {
  const mapped = { asArray: processed };

  processed.forEach((item) => {
    mapped[item.index] = item.value;
  });
  return mapped;
};

export const node: NodeDefinition = {
  description:
    "Generates an arithmetic f(n)= c + (f(n-1)) series of numbers based on the base value, steps down, steps and increment.",
  defaults,
  type,
  process,
  mapOutput,
};
