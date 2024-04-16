import { INodeDefinition, Node, StringSchema } from '@tokens-studio/graph-engine'
import { TokenSetSchema } from "@/schemas/index.js";



export default class ExternalTokensNode extends Node {
  static title = "External Token Set";
  static type = 'studio.tokens.design.externalSet';
  static description =
    "Retrives an external set of tokens and then exposes them";
  constructor(props: INodeDefinition) {
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
