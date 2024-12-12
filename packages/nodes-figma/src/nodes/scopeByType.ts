import { FigmaScope } from "../types/scopes.js";
import {
  INodeDefinition,
  Node,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "@tokens-studio/graph-engine-nodes-design-tokens/schemas/index.js";
import { mergeTokenExtensions } from "../utils/tokenMerge.js";

export default class NodeDefinition extends Node {
  static title = "Scope By Type";
  static type = "studio.tokens.figma.scopeByType";
  static description = "Automatically sets Figma scopes based on token type";

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
        description: "The design token to automatically scope",
      },
    });

    this.addOutput("token", {
      type: TokenSchema,
    });
  }

  private getScopesByType(token: SingleToken): FigmaScope[] {
    switch (token.type) {
      case "color":
        return ["ALL_FILLS", "STROKE_COLOR", "EFFECT_COLOR"];
      case "dimension":
        return [
          "GAP",
          "WIDTH_HEIGHT",
          "CORNER_RADIUS",
          "STROKE_FLOAT",
          "EFFECT_FLOAT",
          "PARAGRAPH_INDENT",
        ];
      case "spacing":
        return ["GAP", "WIDTH_HEIGHT"];
      case "borderRadius":
        return ["CORNER_RADIUS"];
      case "fontFamilies":
        return ["FONT_FAMILY"];
      case "fontWeights":
        return ["FONT_WEIGHT"];
      case "fontSizes":
        return ["FONT_SIZE"];
      case "lineHeights":
        return ["LINE_HEIGHT"];
      case "letterSpacing":
        return ["LETTER_SPACING"];
      case "paragraphSpacing":
        return ["PARAGRAPH_SPACING"];
      case "opacity":
        return ["OPACITY"];
      case "sizing":
        return ["WIDTH_HEIGHT"];
      default:
        return [];
    }
  }

  execute(): void | Promise<void> {
    const { token } = this.getAllInputs();
    const newScopes = this.getScopesByType(token);

    const modifiedToken = mergeTokenExtensions(token, {
      scopes: newScopes,
    });

    this.outputs.token.set(modifiedToken);
  }
}
