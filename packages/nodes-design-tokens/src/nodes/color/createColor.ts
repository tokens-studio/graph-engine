import {
  ColorSchema,
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { ReferenceSchema, TokenColorSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Create Color Token";
  static type = "studio.tokens.design.color.create";
  static description = "Creates a color token from inputs";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("name", {
      type: StringSchema,
    });
    this.addInput("color", {
      type: ColorSchema,
    });
    this.addInput("description", {
      type: StringSchema,
    });
    this.addInput("reference", {
      type: ReferenceSchema,
    });

    this.addOutput("token", {
      type: TokenColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { name, reference, color, description } = this.getAllInputs();

    const colorToken = {
      name,
      description,
      value: color,
      type: "color",
      reference,
    };

    // Remove undefined properties
    Object.keys(colorToken).forEach(key => 
      colorToken[key] === undefined && delete colorToken[key]
    );

    this.setOutput("token", colorToken);
  }
}
