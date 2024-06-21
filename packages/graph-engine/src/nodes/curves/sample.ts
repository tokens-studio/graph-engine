import { Curve } from "../../types.js";
import {
  CurveSchema,
  NumberSchema,
  Vec2Schema,
} from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";


const scaleVec = (vec, scale) => vec.map((v) => v * scale);
const addVec = (vec1, vec2) => vec1.map((v, i) => v + vec2[i]);

const sampleBezier = (bezier: Curve["curves"][0], sample) => {
  const { points } = bezier;
  const [a, b, c, d] = points;

  return [
    scaleVec(a, -(sample ** 3) + 3 * sample ** 2 - 3 * sample + 1),
    scaleVec(b, 3 * sample ** 3 - 6 * sample ** 2 + 3 * sample),
    scaleVec(c, -3 * sample ** 3 + 3 * sample ** 2),
    scaleVec(d, sample ** 3),
  ].reduce(addVec, [0, 0]);
};

export default class NodeDefinition extends Node {
  static title = "Sample Curve";
  static type = "studio.tokens.curve.sample";
  static description = "Samples a curve at a specified point";

  declare inputs: ToInput<{
    /**
     * The curve to sample
     */
    curve: Curve;
    /**
     * The sample point to evaluate the curve at. This should be a value between 0 and 1
     */
    sample: number;
  }>;

  declare outputs: ToOutput<{
    /**
     * A 2D vector representing the value of the curve at the sample point
     */
    value: [number, number];
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("curve", {
      type: CurveSchema,
    });
    this.addInput("sample", {
      type: {
        ...NumberSchema,
        default: 0.5,
      }
    });
    this.addOutput("value", {
      type: Vec2Schema,
    });
    this.addOutput("x", {
      type: NumberSchema,
    });
    this.addOutput("y", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { curve, sample } = this.getAllInputs();
    //TODO this currently assumes that the curve is purely just beziers
    //First look for the bezier that contains the sample
    const foundCurve = (curve as Curve).curves.find(
      (piece) =>
        piece.points[0][0] <= sample &&
        piece.points[piece.points.length - 1][0] >= sample
    );

    if (!foundCurve) throw new Error("No curve found for sample");

    const output = sampleBezier(foundCurve, sample);

    this.setOutput("value", output);
    this.setOutput("x", output[0]);
    this.setOutput("y", output[1]);
  }
}
