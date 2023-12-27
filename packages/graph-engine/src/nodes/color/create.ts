import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { ColorSchema, NumberSchema, StringSchema } from "@/schemas/index.js";
import chroma from "chroma-js";
export { ColorModifierTypes } from "@tokens-studio/types";

export const colorSpaces = [
  "rgb",
  "hsl",
  "hsv",
  "hsi",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "hcl",
  "cmyk",
  "gl",
];

export default class NodeDefinition extends Node {
  static title = "Create Color";
  static type = NodeTypes.CREATE_COLOR;
  static description = "Creates a color";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
        default: "rgb",
      },
    });
    this.addInput("a", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("b", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("c", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("d", {
      type: NumberSchema,
      visible: true,
    });

    this.addOutput("value", {
      type: ColorSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, c, d, space } = this.getAllInputs();

    const converted = chroma([a, b, c, d], space).hex();
    this.setOutput("value", converted);
  }
}
