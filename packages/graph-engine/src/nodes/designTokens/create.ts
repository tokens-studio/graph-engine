import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema, TokenSchema } from "@/schemas/index.js";
import { TokenTypes } from "@tokens-studio/types";

const types = Object.values(TokenTypes).sort();

export default class NodeDefinition extends Node {
  static title = "Create Design Token";
  static type = NodeTypes.CREATE_DESIGN_TOKEN;
  static description = "Creates a design token from inputs";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("name", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("type", {
      type: {
        ...StringSchema,
        enum: types,
      },
      visible: true,
    });
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });

    this.addOutput("token", {
      type: TokenSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    this.setOutput("token", props);
  }
}
