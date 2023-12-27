// nearestTokens.js
import { WcagVersion, sortTokens } from "../../utils/sortTokens.js";
import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import {
  ColorSchema,
  StringSchema,
  BooleanSchema,
  TokenArraySchema,
} from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Name Color";
  static type = NodeTypes.NEAREST_TOKENS;
  static description = "Sorts Token Set by distance to Color";
  constructor(props?: INodeDefinition) {
    super(props);

    this.addInput("tokens", {
      type: TokenArraySchema,
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
      type: TokenArraySchema,
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
      inverted
    );

    this.setOutput("value", sortedTokens);
  }
}
