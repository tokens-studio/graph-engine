import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { TokenSetSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Inline Token Set";
  static type = NodeTypes.INLINE_SET;
  static description =
    "Creates a set of tokens and stores it directly in the graph";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: TokenSetSchema,
    });
    this.addOutput("value", {
      type: TokenSetSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const value = this.getInput("value");
    this.setOutput("value", value);
  }
}
