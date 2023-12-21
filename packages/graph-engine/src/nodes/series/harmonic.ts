import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

type HarmonicValue = {
  index: number;
  value: number;
};

export default class NodeDefinition extends Node {
  static title = "Harmonic Series";
  static type = NodeTypes.HARMONIC_SERIES;
  static description =
    'A "Harmonic Series" is a sequence of numbers whose reciprocals form an arithmetic progression. For example, in the series 1, 1/2, 1/3, 1/4, 1/5, the reciprocals form an arithmetic progression with common difference 1/6.';
  constructor(props?: INodeDefinition) {
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
    this.addInput("steps", {
      type: {
        ...NumberSchema,
        default: 5,
      },
    });
    this.addInput("notes", {
      type: {
        ...NumberSchema,
        default: 5,
      },
    });

    this.addInput("ratio", {
      type: {
        ...NumberSchema,
        default: 2,
      },
    });

    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 2,
      },
    });
    this.addOutput("array", {
      type: NumberArraySchema,
      visible: true,
    });
    this.addOutput("indexed", {
      type: {
        $id: `https://schemas.tokens.studio/${NodeTypes.HARMONIC_SERIES}/indexed.json`,
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
    const { base, precision, ratio, stepsDown, steps, notes } =
      this.getAllInputs();

    const values: HarmonicValue[] = [];

    for (let i = 0 - stepsDown; i <= steps; i++) {
      const shift = 10 ** precision;
      const size = base * Math.pow(ratio, i / notes);
      const rounded = Math.round(size * shift) / shift;
      values.push({
        index: i,
        value: rounded,
      });
    }

    this.setOutput(
      "array",
      values.map((x) => x.value)
    );
    this.setOutput("value", values);
  }
}
