// src/nodes/color/hexToColor.ts
import { ColorSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { Output, ToInput, ToOutput } from "../../programmatic/index.js";
import Color from "colorjs.io";

export default class TextToColorNode extends Node {
  static title = "String to Color";
  static type = "studio.tokens.color.stringToColor";
  static description = "Converts a color string to a color type.";

  declare inputs: ToInput<{
    string: string;
  }>;

  declare outputs: ToOutput<{
    color: Output;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("string", {
      type: {
        ...StringSchema,
        default: "#000000",
      },
    });
    this.addOutput("color", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { string } = this.getAllInputs();
    
    try {
      const color = new Color(string);
      const outputColor = color.to("srgb").toString({format: "hex"});
      this.setOutput("color", outputColor);
    } catch (error) {
      this.error = new Error(`Invalid hex color: ${string}`);
    }
  }
}