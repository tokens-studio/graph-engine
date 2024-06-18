
import { INodeDefinition, Node, StringSchema } from '@tokens-studio/graph-engine'
import { TokenSetSchema } from "../schemas/index.js";


export default class GroupNode extends Node {
  static title = "Group tokens";
  static type = 'studio.tokens.design.group';
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
