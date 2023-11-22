import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ARITHMETIC_SERIES;

export const defaults = {
  base: 16,
  stepsDown: 0,
  steps: 1,
  increment: 1,
  precision: 0,
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const sizes: Output = [];
  //Fixes issue with string concatenation
  const base = parseFloat(final.base);
  const shift = 10 ** final.precision;

  for (let i = Math.abs(final.stepsDown); i > 0; i--) {
    const value = Math.round((base - final.increment * i) * shift) / shift;
    sizes.push({
      step: 0 - i,
      size: value,
    });
  }
  sizes.push({
    step: 0,
    size: Math.round(final.base * shift) / shift,
  });

  for (let i = 0; i < Math.abs(final.steps); i++) {
    const value = Math.round((base + final.increment * (i + 1)) * shift) / shift;
    sizes.push({
      step: i + 1,
      size: value,
    });
  }

  return sizes;
};

export type Output = {
  size: number;
  step: number;
}[];

export const mapOutput = (input, state, processed) => {
  const mapped = { asArray: processed.map((item) => item.size) };

  processed.forEach((item) => {
    mapped[`${item.step}`] = item.size;
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
