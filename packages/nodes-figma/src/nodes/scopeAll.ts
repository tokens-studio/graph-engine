import { FigmaScope } from "../types/scopes.js";
import {
  INodeDefinition,
  Node,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "@tokens-studio/graph-engine-nodes-design-tokens";

export default class NodeDefinition extends Node {
  static title = "Scope All";
  static type = "studio.tokens.figma.scopeAll";
  static description = "Adds ALL_SCOPES scope to a Figma token";

  declare inputs: ToInput<{
    token: SingleToken;
  }>;
  declare outputs: ToOutput<{
    token: SingleToken;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("token", {
      type: {
        ...TokenSchema,
        description: "The design token to add ALL_SCOPES to",
      },
    });

    this.addOutput("token", {
      type: TokenSchema,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();

    // Get existing Figma extension and scopes
    const existingFigmaExt = inputs.token.$extensions?.["com.figma"] || {};
    const existingScopes = existingFigmaExt.scopes || [];

    // Add ALL_SCOPES if it doesn't exist
    const newScopes: FigmaScope[] = existingScopes.includes("ALL_SCOPES")
      ? existingScopes
      : [...existingScopes, "ALL_SCOPES"];

    // Create the modified token with merged Figma scopes
    const modifiedToken = {
      ...inputs.token,
      $extensions: {
        ...inputs.token.$extensions,
        "com.figma": {
          ...existingFigmaExt,
          scopes: newScopes,
        },
      },
    };

    this.outputs.token.set(modifiedToken);
  }
}
