import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema, TokenSetSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "External Token Set";
  static type = NodeTypes.EXTERNAL_TOKEN_SET;
  static description =
    "Retrives an external set of tokens and then exposes them";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("uri", {
      type: StringSchema,
    });
    this.addOutput("value", {
      type: TokenSetSchema,
      visible: true,
    });
  }

  async execute() {
    const { uri } = this.getAllInputs();

    if (!uri) {
      throw new Error("No uri specified");
    }

    const tokens = await this.load(uri);
    this.setOutput("value", tokens);
  }
}
