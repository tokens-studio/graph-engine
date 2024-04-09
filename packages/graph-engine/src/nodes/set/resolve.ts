import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { TokenArrayArraySchema, TokenArraySchema } from "@/schemas/index.js";
import {
  IResolvedToken,
  flatTokensRestoreToMap,
  flatten,
} from "../../utils/index.js";
import { transformTokens } from "token-transformer";

const resolveValues = (tokens: IResolvedToken[], context: IResolvedToken[]) => {
  const setsToUse = ["root", "excludes"];

  const rawTokens = {
    root: flatTokensRestoreToMap(tokens),
    excludes: flatTokensRestoreToMap(context),
  };

  //We don't want the modifiers to contribute to the final values
  const excludes = ["excludes"];

  const resolved = transformTokens(rawTokens, setsToUse, excludes, {
    expandTypography: false,
    expandShadow: false,
    expandComposition: true,
    preserveRawValue: false,
    throwErrorWhenNotResolved: false,
    resolveReferences: true,
  });

  return flatten(resolved);
};

export default class NodeDefinition extends Node {
  static title = "Resolve tokens";
  static type = NodeTypes.ALIAS;
  static description = "Resolves a set of tokens";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("inputs", {
      type: TokenArrayArraySchema,
      visible: true,
    });
    this.addInput("context", {
      type: TokenArrayArraySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: TokenArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { inputs, context } = this.getAllInputs();

    const resolved = resolveValues(inputs.flat(), context.flat());
    this.setOutput("value", resolved);
  }
}
