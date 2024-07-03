import {
  ColorSchema,
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { ReferenceSchema, TokenColorSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Deconstruct Color Token";
  static type = "studio.tokens.design.color.deconstruct";
  static description = "Deconstruct a color token from inputs";

  constructor(props: INodeDefinition) {
    super(props);
    
    this.addInput("token", {
      type: TokenColorSchema,
    });

    this.addOutput("name", {
      type: StringSchema,
    });
    this.addOutput("color", {
      type: ColorSchema,
    });
    this.addOutput("description", {
      type: StringSchema,
    });
    this.addOutput("reference", {
      type: ReferenceSchema,
    });
    this.addOutput("type", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const token = this.getInput("token");

    if (token) {
      const { name, value, description, reference, type } = token;

      this.setOutput("name", name);
      this.setOutput("color", value);
      this.setOutput("description", description);
      this.setOutput("reference", reference);
      this.setOutput("type", type);
    } else {
      // If no token is provided, set all outputs to undefined
      this.setOutput("name", undefined);
      this.setOutput("color", undefined);
      this.setOutput("description", undefined);
      this.setOutput("reference", undefined);
      this.setOutput("type", undefined);
    }
  }
}
