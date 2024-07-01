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
    this.addInput("token", {
      type: TokenColorSchema,
      visible: true,
    });

    this.addOutput("name", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("reference", {
      type: ReferenceSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: {
        ...ColorObjectSchema,
      },
      visible: true,
    });
    this.addOutput("description", {
      type: StringSchema,
      visible: true,
    });

  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    this.setOutput("name", props.name);
  }
}
