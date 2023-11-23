import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.HARMONIC_SERIES;

export const defaults = {
  base: 16,
  ratio: 1.5,
  stepsDown: 0,
  steps: 5,
  notes: 1,
  precision: 2,
};

type HarmonicValue = {
  size: number;
  frequency: number;
  note: number;
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const values: HarmonicValue[] = [];

  for (let i = 0 - final.stepsDown; i < final.steps; i++) {
    for (let j = 0; j < final.notes; j++) {
      const shift = 10 ** final.precision;
      const size =
        final.base * Math.pow(final.ratio, (i * final.notes + j) / final.notes);
      const rounded = Math.round(size * shift) / shift;
      values.push({
        size: rounded,
        frequency: i,
        note: j,
      });
    }
  }

  return values;
};

export const mapOutput = (input, state, processed: HarmonicValue[]) => {
  const mapped = { asArray: processed };

  processed.forEach((item) => {
    mapped[`${item.frequency}-${item.note}`] = item.size;
  });
  return mapped;
};

export const node: NodeDefinition = {
  description:
    'A "Harmonic Series" is a sequence of numbers whose reciprocals form an arithmetic progression. For example, in the series 1, 1/2, 1/3, 1/4, 1/5, the reciprocals form an arithmetic progression with common difference 1/6.',
  defaults,
  type,
  process,
  mapOutput,
};
