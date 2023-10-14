import { NodeDefinition, NodeTypes } from "../../types.js";
import { generateColorStops } from "./lib/generateColorScale.js";

export const type = NodeTypes.SCALE;

export type State = {
  steps: number;
  color: string;
  lightnessCurve: number[];
  chromaCurve: number[];
  hueCurve: number[];
};

export const defaults: State = {
  steps: 10,
  color: "#ff0000",
  lightnessCurve: [0.25, 0.25, 0.75, 0.75],
  chromaCurve: [1, 1, 0, 1, 1, 1],
  hueCurve: [0, 0, 0.25, 0, 0.75, 0],
};

function createColorObject(x, i, totalSteps) {
  let name;
  if (totalSteps === 11) {
    if (i === 0) {
      name = "50";
    } else if (i === 10) {
      name = "950";
    } else {
      name = "" + i * 100;
    }
  } else {
    name = "" + (i + 1) * 100;
  }

  return {
    name,
    value: x,
    type: "color",
  };
}

export type Input = {
  color: string;
} & State;

export const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const steps = Math.max(0, parseInt("" + final.steps));
  const color = final.color || defaults.color;
  const lightnessCurve = final.lightnessCurve || defaults.lightnessCurve;
  const chromaCurve = final.chromaCurve || defaults.chromaCurve;
  const hueCurve = final.hueCurve || defaults.hueCurve;

  const parts = generateColorStops(
    steps,
    color,
    lightnessCurve,
    chromaCurve,
    hueCurve,
  );

  return parts;
};

export const mapOutput = (input, state, processed) => {
  const totalSteps = parseInt(state.steps);
  // if totalSteps equals 11, start at 50, then 100-900, then 950. for everything else, use 100, 200, etc

  const array = processed.map((x, i) => createColorObject(x, i, totalSteps));

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
