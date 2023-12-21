import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { TokenArraySchema } from "@/schemas/index.js";
import { SingleToken } from "@tokens-studio/types";

export default class NodeDefinition extends Node {
  static title = "Flatten Token Sets";
  static type = NodeTypes.FLATTEN;
  static description = "Flattens a set of tokens";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("tokens", {
      type: TokenArraySchema,
      variadic: true,
      visible: true,
    });
    this.addOutput("value", {
      type: TokenArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { tokens } = this.getAllInputs();

    const { vals } = (tokens as SingleToken[][])
      .flat()
      .flat()
      .reduceRight(
        (acc, val: SingleToken) => {
          if (acc.lookup[val.name]) {
            return acc;
          }
          //Must be the first time we've seen this key
          acc.lookup[val.name] = true;
          acc.vals.push(val);
          return acc;
        },
        {
          vals: [] as SingleToken[],
          lookup: {},
        }
      );
    this.setOutput("value", vals.reverse());
  }
}
