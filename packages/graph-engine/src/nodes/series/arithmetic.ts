import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ARITHMETIC_SERIES;

export const defaults = {
  base: 16,
  stepsDown: 0,
  steps: 1,
  increment: 1,
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const sizes: Output = [];
  //Fixes issue with string concatenation
  const base = parseFloat(final.base);

  for (let i = Math.abs(final.stepsDown); i > 0; i--) {
    const value = base - final.increment * i;
    sizes.push({
      step: 0 - i,
      size: value,
    });
  }
  sizes.push({
    step: 0,
    size: final.base,
  });

  for (let i = 0; i < Math.abs(final.steps); i++) {
    const value = base + final.increment * (i + 1);
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
  defaults,
  type,
  process,
  mapOutput,
};
