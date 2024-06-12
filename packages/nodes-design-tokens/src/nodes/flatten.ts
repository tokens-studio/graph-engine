import { TokenSchema, TokenSetSchema } from "../schemas/index.js";
import { SingleToken } from "@tokens-studio/types";
import { INodeDefinition, Node, createVariadicSchema } from '@tokens-studio/graph-engine'
import { arrayOf } from "../schemas/utils.js";

export default class FlattenNode extends Node {
  static title = "Flatten Token Sets";
  static type = 'studio.tokens.design.flatten';
  static description = "Flattens a set of tokens";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("tokens", {
      type: {
        ...createVariadicSchema(TokenSchema),
        default: [],
      },
      variadic: true,
      visible: true,
    });
    this.addOutput("value", {
      type: arrayOf(TokenSchema),
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
