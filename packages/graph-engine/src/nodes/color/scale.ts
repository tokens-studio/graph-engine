import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";
import { Bezier } from 'bezier-js';

export const type = NodeTypes.SCALE;

export type State = {
  stepsUp: number;
  stepsDown: number;
  chromaCurve: number[];
};

export const defaults: State = {
  stepsUp: 4,
  stepsDown: 4,
  chromaCurve: [.5, 0, .5, 1],
};

export type Input = {
  color: string;
} & State;

function transformArray(array) {
  if (array.length !== 4) {
    throw new Error('Input array must have exactly four elements');
  }

  return [
    { x: 0, y: 0 },
    { x: array[0], y: array[1] },
    { x: array[2], y: array[3] },
    { x: 1, y: 1 },
  ];
}

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
    .slice(1, stepsUp - 1);
  const darker = chroma
    .scale([final.color, "black"])
    .mode("hsl")
    .colors(stepsDown)
    .slice(1, stepsDown - 1);

  // Create the control colors for the bezier curve
  const allColors = [...lighter, final.color, ...darker];
  const allColorScale = chroma.scale(allColors);

  const chromaCurve = new Bezier(transformArray(final.chromaCurve || defaults.chromaCurve));

  const parts = allColors.map((color, index) => {
    const point = chromaCurve.get((index + 1) / allColors.length);
    const value: number = point.y;
    const colorOnValue = allColorScale(value).hex();
    return colorOnValue;
  });

 // Create the saturation and chroma curves
// const chromaCurve = new Bezier(transformArray(final.chromaCurve));

// const parts = allColors.map((color, index) => {
//   // Get the position on the curves
//   const t = (index + 1) / allColors.length;
//   const chromaPoint = chromaCurve.get(t);

//   // get the saturation of the base color

//   // Adjust the color using the saturation and chroma curves
//   const adjustedColor = chroma(color)
//     .set('hsl.l', 1 - chromaPoint.y);

//   return adjustedColor.hex();
// });


  return ([] as string[]).concat(parts) as string[];
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

export const mapOutput = (input, state, processed) => {
  const totalSteps = parseInt(state.stepsUp) + parseInt(state.stepsDown) + 1;
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
