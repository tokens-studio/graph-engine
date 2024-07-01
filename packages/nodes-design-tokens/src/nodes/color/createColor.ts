import {
  ColorObjectSchema,
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
    this.addInput("reference", {
      type: ReferenceSchema,
    });
    this.addInput("value", {
      type: ColorObjectSchema,
    });
    this.addInput("description", {
      type: StringSchema,
    });

    this.addOutput("token", {
      type: TokenColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    this.setOutput("token", props);
  }
}
