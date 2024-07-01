import {
  ColorObjectSchema,
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
    this.addOutput("reference", {
      type: ReferenceSchema,
    });
    this.addOutput("value", {
      type: ColorObjectSchema,
    });
    this.addOutput("description", {
      type: StringSchema,
    });

  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    this.setOutput("name", props.name);
  }
}
