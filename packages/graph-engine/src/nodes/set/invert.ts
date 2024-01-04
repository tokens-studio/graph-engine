import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { TokenSetSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Invert Token Set";
  static type = NodeTypes.INVERT_SET;
  static description = "Inverts the order of a set of tokens";
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
    const value = this.getInput("value") as any[];

    const inverted = value.map((x, i) => {
      const vals = inverted[inverted.length - i - 1];
      return {
        ...vals,
        name: x.name,
      };
    });

    this.setOutput("value", value);
  }
}
