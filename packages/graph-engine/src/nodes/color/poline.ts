import { NodeDefinition, NodeTypes } from "../../types.js";
import { Hsl, converter, formatHex } from "culori";
import { Poline, PositionFunction, Vector3, positionFunctions } from "poline";

export const type = NodeTypes.POLINE;

export const defaults: PolineNodeInput = {
  anchorColors: [],
  numPoints: 4,
};

export type PolineNodeOptions = {
  anchorColors: Vector3[];
  numPoints: number;
  invertedLightness?: boolean;
  positionFunctionX?: PositionFunction;
  positionFunctionY?: PositionFunction;
  positionFunctionZ?: PositionFunction;
};

export type PolineNodeInput = {
  anchorColors: string[];
  numPoints?: number;
  invertedLightness?: boolean;
  positionFnX?: string;
  positionFnY?: string;
  positionFnZ?: string;
  hueShift?: number;
};

const convertHexToHsl = (hexColor: string): Vector3 => {
  let hsl = converter("hsl");

  const hslColor = hsl(hexColor) as Hsl;

  return [hslColor.h ?? 0, hslColor.s, hslColor.l];
};

const validateInputs = (input: PolineNodeInput, state) => {
  if (!input.anchorColors || input.anchorColors.length < 2) {
    throw new Error("Not enough color inputs");
  }

  input.anchorColors.forEach((hexColor) => {
    let hsl = converter("hsl");

    const hslColor = hsl(hexColor);
    if (!hslColor || hslColor.h === undefined) {
      throw new Error("Invalid color input");
    }
  });
};

const convertToInt = (value): number => {
  return typeof value === "string" ? parseInt(value, 10) : value;
};

const convertToFloat = (value): number => {
  return typeof value === "string" ? parseFloat(value) : value;
};

export const process = (
  input: PolineNodeInput,
  state: PolineNodeInput
): string[] => {
  const final: PolineNodeInput = {
    ...state,
    ...input,
  };

  final.numPoints = convertToInt(final.numPoints);
  final.hueShift = convertToFloat(final.hueShift);

  if (final.anchorColors.length < 2) {
    return [];
  }

  const polineOptions: PolineNodeOptions = {
    ...final,
    numPoints: final.numPoints ?? 4,
    anchorColors: final.anchorColors.map((hexColor) =>
      convertHexToHsl(hexColor)
    ),
    positionFunctionX:
      positionFunctions[
        final.positionFnX ? final.positionFnX : "sinusoidalPosition"
      ],
    positionFunctionY:
      positionFunctions[
        final.positionFnY ? final.positionFnY : "sinusoidalPosition"
      ],
    positionFunctionZ:
      positionFunctions[
        final.positionFnZ ? final.positionFnZ : "sinusoidalPosition"
      ],
  };

  const poline = new Poline(polineOptions);
  if (final.hueShift) {
    poline.shiftHue(final.hueShift);
  }

  const hexColors: string[] = [];

  poline.colorsCSS.forEach((hslColor) => {
    const hexColor = formatHex(hslColor);
    if (hexColor) {
      hexColors.push(hexColor);
    }
  });

  return hexColors;
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

export const node: NodeDefinition<PolineNodeInput, PolineNodeInput> = {
  type,
  validateInputs,
  defaults,
  process,
  mapOutput,
};
