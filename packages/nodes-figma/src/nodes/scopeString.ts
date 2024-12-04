import {
  BooleanSchema,
  INodeDefinition,
  Node,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { FigmaScope } from "../types/scopes.js";
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "@tokens-studio/graph-engine-nodes-design-tokens/schemas/index.js";
import { mergeTokenExtensions } from "../utils/tokenMerge.js";

export default class NodeDefinition extends Node {
  static title = "Scope String";
  static type = "studio.tokens.figma.scopeString";
  static description = "Defines string variable scopes for Figma";

  declare inputs: ToInput<{
    token: SingleToken;
    fontFamily: boolean;
    fontStyle: boolean;
    textContent: boolean;
  }>;
  declare outputs: ToOutput<{
    token: SingleToken;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("token", {
      type: {
        ...TokenSchema,
        description: "The design token to add scopes to",
      },
    });

    this.addInput("fontFamily", {
      type: {
        ...BooleanSchema,
        default: false,
        description: "Include font family scope",
      },
    });

    this.addInput("fontStyle", {
      type: {
        ...BooleanSchema,
        default: false,
        description: "Include font weight or style scope",
      },
    });

    this.addInput("textContent", {
      type: {
        ...BooleanSchema,
        default: false,
        description: "Include text content scope",
      },
    });

    this.addOutput("token", {
      type: TokenSchema,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    const newScopes: FigmaScope[] = [];

    // Map inputs to corresponding scopes
    if (inputs.fontFamily) newScopes.push("FONT_FAMILY");
    if (inputs.fontStyle) newScopes.push("FONT_STYLE");
    if (inputs.textContent) newScopes.push("TEXT_CONTENT");

    const modifiedToken = mergeTokenExtensions(inputs.token, {
      scopes: newScopes,
    });

    this.outputs.token.set(modifiedToken);
  }
}
