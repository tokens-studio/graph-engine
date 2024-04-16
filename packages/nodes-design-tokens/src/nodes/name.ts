
import { INodeDefinition, Node } from "@tokens-studio/graph-engine";
import { TokenArraySchema, TokenSetSchema } from "@/schemas/index.js";


export default class NameTokensNode extends Node {
  static title = "Name tokens";
  static type = 'studio.tokens.design.nameTokens';
  static description = "Names an array of tokens by their index";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: TokenArraySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: TokenArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { array } = this.getAllInputs();

    const renamed = array.map((token, index) => {
      return {
        ...token,
        name: `${(index + 1) * 100}`,
      };
    });

    this.setOutput("value", renamed);
  }
}
