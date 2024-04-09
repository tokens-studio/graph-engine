import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema, TokenSetSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Ungroup tokens";
  static type = NodeTypes.UNGROUP;
  static description = "Ungroups tokens by removing their namespace";
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

    const accessorParts = accessor.split(".");

    //We assume that we will throw an error if we cannot find the values
    let output = tokens;
    for (const accessor of accessorParts) {
      output = output[accessor];
    }

    this.setOutput("value", output);
  }
}
