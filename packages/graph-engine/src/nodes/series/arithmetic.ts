import { INodeDefinition, Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";
import { ToInput } from "../../programmatic/input.js";
import { ToOutput } from "../../programmatic";
import { arrayOf } from "../../schemas/utils.js";
import { setToPrecision } from "../../utils/precision.js";
export type ArithemeticValue = {
  index: number;
  value: number;
};

export default class NodeDefinition extends Node {
  static title = "Arithmetic Series";

  declare inputs: ToInput<{
    base: number;
    stepsDown: number;
    stepsUp: number;
    increment: number;
    precision: number;
  }>;

  declare outputs: ToOutput<{
    array: number[];
    indexed: ArithemeticValue[];
  }>;

  static type = "studio.tokens.series.arithmetic";
  static description =
    "Generates an arithmetic f(n)= c + (f(n-1)) series of numbers based on the base value, steps down, steps and increment.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("base", {
      type: {
        ...NumberSchema,
        default: 16,
      },
    });
    this.addInput("stepsDown", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addInput("stepsUp", {
      type: {
        ...NumberSchema,
        default: 1,
      },
    });

    this.addInput("increment", {
      type: {
        ...NumberSchema,
        default: 1,
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
    });
    this.addOutput("indexed", {
      type: {
        $id: `https://schemas.tokens.studio/studio.tokens.series.arithmetic/indexed.json`,
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
    const { base, precision, increment, stepsDown, stepsUp } =
      this.getAllInputs();

    const values: ArithemeticValue[] = [];

    for (let i = Math.abs(stepsDown); i > 0; i--) {
      const value = setToPrecision((base - increment * i), precision);
      values.push({
        index: 0 - i,
        value: value,
      });
    }
    values.push({
      index: 0,
      value: setToPrecision((base), precision),
    });

    for (let i = 0; i < Math.abs(stepsUp); i++) {
      const value = setToPrecision((base + increment * (i + 1)), precision);
      values.push({
        index: i + 1,
        value: value,
      });
    }

    this.setOutput(
      "array",
      values.map((x) => x.value),
    );
    this.setOutput("indexed", values);
  }
}
