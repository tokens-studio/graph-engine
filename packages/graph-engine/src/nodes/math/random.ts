import { INodeDefinition, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Random";
  static type = "studio.tokens.math.random";
  static description =
    "Random node allows you to generate a random number between 0 and 1.";

  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addOutput("value", {
      type: {
        ...NumberSchema,
        default: Math.random(),
      },
    });
  }

  execute(): void | Promise<void> {
    //Noop, random is generated on node creation
  }
}
