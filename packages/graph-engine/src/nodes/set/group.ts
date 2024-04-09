import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema, TokenSetSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Group tokens";
  static type = NodeTypes.GROUP;
  static description = "Groups tokens by adding a namespace";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("accessor", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("tokens", {
      type: TokenSetSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: TokenSetSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { accessor, tokens } = this.getAllInputs();
    const output = { [accessor]: tokens };

    this.setOutput("value", output);
  }
}
