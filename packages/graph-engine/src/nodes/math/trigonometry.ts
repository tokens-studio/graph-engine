// src/nodes/math/trigonometry.ts

import { BooleanSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";

enum TrigFunction {
  SIN = "sin",
  COS = "cos",
  TAN = "tan"
}

export default class TrigonometryNode extends Node {
  static title = "Trigonometry";
  static type = "studio.tokens.math.trigonometry";
  static description = "Calculates trigonometric values for a given angle";

  declare inputs: ToInput<{
    angle: number;
    function: TrigFunction;
    isDegrees: boolean;
  }>;

  declare outputs: ToOutput<{
    result: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("angle", {
      type: NumberSchema,
    });
    this.addInput("function", {
      type: {
        ...StringSchema,
        enum: Object.values(TrigFunction),
        default: TrigFunction.SIN,
      },
    });
    this.addInput("isDegrees", {
      type: {
        ...BooleanSchema,
        default: true,
      },
    });

    this.addOutput("result", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { angle, function: trigFunction, isDegrees } = this.getAllInputs();

    let radians = angle;
    if (isDegrees) {
      radians = (angle * Math.PI) / 180;
    }

    let result: number;

    switch (trigFunction) {
      case TrigFunction.SIN:
        result = Math.sin(radians);
        break;
      case TrigFunction.COS:
        result = Math.cos(radians);
        break;
      case TrigFunction.TAN:
        result = Math.tan(radians);
        break;
      default:
        throw new Error(`Unsupported trigonometric function: ${trigFunction}`);
    }

    // Round to 6 decimal places to avoid floating point precision issues
    result = Number(result.toFixed(6));

    this.setOutput("result", result);
  }
}