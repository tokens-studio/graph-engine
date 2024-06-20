import { INodeDefinition, Node } from "@tokens-studio/graph-engine";
import { TokenSchema, TokenSetSchema } from "../schemas/index.js";
import { arrayOf } from "../schemas/utils.js";
import { flatten } from "../utils/index.js";

export default class SetToArrayNode extends Node {
  static title = "Token set to token aray ";
  static type = "studio.tokens.design.setToArray";
  static description = "Converts a token set to an array of tokens";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("set", {
      type: TokenSetSchema,
      visible: true,
    });
    this.addOutput("tokens", {
      type: arrayOf(TokenSchema),
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const set = this.getInput("set");

    const tokens = flatten(set);

    this.setOutput("tokens", tokens);
  }
}
