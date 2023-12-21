import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Subgraph";
  static type = NodeTypes.SUBGRAPH;
  static description = "Allows you to load another subgraph";
  constructor(props?: INodeDefinition) {
    super(props);

    this.addInput("graph", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const { top, right, bottom, left } = this.getAllInputs();
    this.setOutput("value", `${top} ${right} ${bottom} ${left}`);
  }
}
