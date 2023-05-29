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

  for (let i = Math.abs(final.stepsDown); i > 0; i--) {
    const value = final.base - final.increment * i;
    sizes.push({
      step: 0 - i,
      size: value,
    });
  }

  for (let i = 0; i < Math.abs(final.steps); i++) {
    const value = final.base + final.increment * i;
    sizes.push({
      step: i,
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
