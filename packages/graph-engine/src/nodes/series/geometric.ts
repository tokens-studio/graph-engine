import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";
import { arrayOf } from "../../schemas/utils.js";

type GeometricValue = {
  index: number;
  value: number;
};

export default class NodeDefinition extends Node {
  static title = "Geometric Series";
  static type = NodeTypes.GEOMETRIC_SERIES;
  static description =
    "Generates a geometric series f(n)= c * (f(n-1)) of numbers based on the base value, steps down, steps and increment.";

  declare inputs: ToInput<{
    base: number;
    stepsDown: number;
    steps: number;
    ratio: number;
    precision: number;
  }>;

  declare outputs: ToOutput<{
    array: number[];
    indexed: GeometricValue[];
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("base", {
      type: {
        ...NumberSchema,
        default: 16,
      },
      visible: true,
    });
    this.addInput("stepsDown", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("stepsUp", {
      type: {
        ...NumberSchema,
        default: 1,
      },
      visible: true,
    });

    this.addInput("ratio", {
      type: {
        ...NumberSchema,
        default: 1.5,
      },
    });

    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 2,
      },
    });
    this.addOutput("array", {
      type: arrayOf(NumberSchema),
      visible: true,
    });
    this.addOutput("indexed", {
      type: {
        $id: `https://schemas.tokens.studio/${NodeTypes.GEOMETRIC_SERIES}/indexed.json`,
        type: "object",
        properties: {
          index: {
            type: NumberSchema,
          },
          value: {
            type: NumberSchema,
          },
        },
      },
      visible: false,
    });
  }

  execute(): void | Promise<void> {
    const { base, precision, ratio, stepsDown, stepsUp } = this.getAllInputs();

    const values: GeometricValue[] = [];
    const shift = 10 ** precision;

    for (let i = 0 - stepsDown; i <= stepsUp; i++) {
      const value = Math.round(base * Math.pow(ratio, i) * shift) / shift;
      values.push({
        index: i,
        value,
      });
    }

    this.setOutput(
      "array",
      values.map((x) => x.value)
    );
    this.setOutput("indexed", values);
  }
}
