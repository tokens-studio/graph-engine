import { INodeDefinition } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import {
  BooleanSchema,
  ColorArraySchema,
  NumberSchema,
  StringArraySchema,
  StringSchema,
} from "../../schemas/index.js";
import { Hsl, converter, formatHex } from "culori";
import { Poline, PositionFunction, Vector3, positionFunctions } from "poline";

export type PolineNodeOptions = {
  anchorColors: Vector3[];
  numPoints: number;
  invertedLightness?: boolean;
  positionFunctionX?: PositionFunction;
  positionFunctionY?: PositionFunction;
  positionFunctionZ?: PositionFunction;
};

const positionFuncs = Object.keys(positionFunctions);

const convertHexToHsl = (hexColor: string): Vector3 => {
  let hsl = converter("hsl");

  const hslColor = hsl(hexColor) as Hsl;

  return [hslColor.h ?? 0, hslColor.s, hslColor.l];
};

export default class NodeDefinition extends Node {
  static title = "Poline";
  static type = NodeTypes.POLINE;
  static description = "";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("anchorColors", {
      type: StringArraySchema,
    });
    this.addInput("numPoints", {
      type: {
        ...NumberSchema,
        default: 4,
      },
    });
    this.addInput("invertedLightness", {
      type: BooleanSchema,
    });
    this.addInput("positionFnX", {
      type: {
        ...StringSchema,
        enum: positionFuncs,
      },
    });
    this.addInput("positionFnY", {
      type: {
        ...StringSchema,
        enum: positionFuncs,
      },
    });
    this.addInput("positionFnZ", {
      type: {
        ...StringSchema,
        enum: positionFuncs,
      },
    });

    this.addInput("hueShift", {
      type: NumberSchema,
    });
    this.addOutput("value", {
      type: ColorArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const {
      numPoints,
      hueShift,
      anchorColors,
      positionFnX,
      positionFnY,
      positionFnZ,
      invertedLightness,
    } = this.getAllInputs();

    if (!anchorColors || anchorColors.length < 2) {
      throw new Error("Not enough color inputs");
    }
    anchorColors.forEach((hexColor) => {
      let hsl = converter("hsl");

      const hslColor = hsl(hexColor) as unknown as Hsl;
      if (!hslColor || hslColor.h === undefined) {
        throw new Error("Invalid color input");
      }
    });

    const polineOptions: PolineNodeOptions = {
      invertedLightness,
      numPoints,
      anchorColors: anchorColors.map((hexColor) => convertHexToHsl(hexColor)),
      positionFunctionX:
        positionFunctions[positionFnX ? positionFnX : "sinusoidalPosition"],
      positionFunctionY:
        positionFunctions[positionFnY ? positionFnY : "sinusoidalPosition"],
      positionFunctionZ:
        positionFunctions[positionFnZ ? positionFnZ : "sinusoidalPosition"],
    };

    const poline = new Poline(polineOptions);
    if (hueShift) {
      poline.shiftHue(hueShift);
    }
    const hexColors: string[] = (poline.colorsCSS as string[]).map(
      (hslColor) => formatHex(hslColor) as string
    );
    this.setOutput("value", hexColors);
  }
}
