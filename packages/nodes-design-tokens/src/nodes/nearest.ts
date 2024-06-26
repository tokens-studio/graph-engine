import {
  BooleanSchema,
  ColorSchema,
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { TokenSchema } from "../schemas/index.js";
import { WcagVersion, sortTokens } from "../utils/sortTokens";
import { arrayOf } from "../schemas/utils.js";

export default class NearestColorNode extends Node {
  static title = "Nearest tokens";
  static type = "studio.tokens.design.nearestColor";
  static description = "Sorts Token Set by distance to Color";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("tokens", {
      type: arrayOf(TokenSchema),
      visible: true,
    });
    this.addInput("sourceColor", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
      visible: true,
    });
    this.addInput("compare", {
      type: {
        ...StringSchema,
        default: "Hue",
        enum: ["Contrast", "Hue", "Lightness", "Saturation", "Distance"],
      },
      visible: true,
    });
    this.addInput("inverted", {
      type: {
        ...BooleanSchema,
        default: false,
      },
      visible: true,
    });
    this.addInput("wcag", {
      type: {
        ...StringSchema,
        default: WcagVersion.V3,
        enum: Object.values(WcagVersion),
      },
      visible: true,
    });

    this.addOutput("value", {
      type: arrayOf(TokenSchema),
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { tokens, sourceColor, compare, wcag, inverted } =
      this.getAllInputs();

    const sortedTokens = sortTokens(
      tokens,
      sourceColor,
      compare,
      wcag,
      inverted,
    );

    this.setOutput("value", sortedTokens);
  }
}
