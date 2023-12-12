

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Random";
  type = NodeTypes.RANDOM;
  description = "Random node allows you to generate a random number between 0 and 1."
  constructor(props: INodeDefinition) {
    super(props);
    this.addOutput("value", {
      type: {
        ...NumberSchema,
        default: Math.random()
      },
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    //Noop, random is generated on node creation
  }
}
