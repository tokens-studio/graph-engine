// src/nodes/curves/bezierCurve.ts

import { Curve } from "../../types.js";
import { CurveSchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";

export default class BezierCurveNode extends Node {
  static title = "Bezier Curve";
  static type = "studio.tokens.curve.bezier";
  static description = "Creates a bezier curve from two control points and provides sampled y-values";

  declare inputs: ToInput<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    samples: number;
  }>;

  declare outputs: ToOutput<{
    curve: Curve;
    values: number[];
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("x1", {
      type: {
        ...NumberSchema,
        default: 0.5,
        minimum: 0,
        maximum: 1,
      },
    });
    this.addInput("y1", {
      type: {
        ...NumberSchema,
        default: 0,
        minimum: 0,
        maximum: 1,
      },
    });
    this.addInput("x2", {
      type: {
        ...NumberSchema,
        default: 0.5,
        minimum: 0,
        maximum: 1,
      },
    });
    this.addInput("y2", {
      type: {
        ...NumberSchema,
        default: 1,
        minimum: 0,
        maximum: 1,
      },
    });
    this.addInput("samples", {
      type: {
        ...NumberSchema,
        default: 100,
        minimum: 2,
        maximum: 1000,
      },
    });

    this.addOutput("curve", {
      type: CurveSchema,
    });
    this.addOutput("values", {
      type: {
        type: "array",
        items: NumberSchema,
      },
    });
  }

  execute(): void | Promise<void> {
    const { x1, y1, x2, y2, samples } = this.getAllInputs();

    const curve: Curve = {
      curves: [
        {
          type: "bezier",
          points: [
            [0, 0],    // Start point
            [x1, y1],  // First control point
            [x2, y2],  // Second control point
            [1, 1],    // End point
          ],
        },
      ],
    };

    const values = this.sampleCurve(x1, y1, x2, y2, samples);

    this.setOutput("curve", curve);
    this.setOutput("values", values);
  }

  private sampleCurve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    samples: number
  ): number[] {
    const values: number[] = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      values.push(this.bezierY(x1, y1, x2, y2, t));
    }
    return values;
  }

  private bezierY(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    t: number
  ): number {
    return Math.pow(1 - t, 3) * 0 +
           3 * Math.pow(1 - t, 2) * t * y1 +
           3 * (1 - t) * Math.pow(t, 2) * y2 +
           Math.pow(t, 3) * 1;
  }
}