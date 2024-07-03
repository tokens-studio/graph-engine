import {
  INodeDefinition,
  Node,
  StringSchema,
  toColor, 
  toColorObject
} from "@tokens-studio/graph-engine";
import { TokenColorSchema } from "../../schemas/index.js";

const colorSpaces = [
  "a98rgb",
  "acescc",
  "acescg",
  "hct",
  "hpluv",
  "hsl",
  "hsluv",
  "hsv",
  "hwb",
  "ictcp",
  "jzazbz",
  "jzczhz",
  "lab-d65",
  "lab",
  "lch",
  "lchuv",
  "luv",
  "oklab",
  "oklch",
  "p3-linear",
  "p3",
  "prophoto-linear",
  "prophoto",
  "rec2020-linear",
  "rec2020",
  "srgb-linear",
  "srgb",
  "xyz-abs-d65",
  "xyz-d50",
  "xyz-d65"
] as const;


export default class NodeDefinition extends Node {
  static title = "Convert Color Space of Token";
  static type = "studio.tokens.design.color.convert";
  static description = "Convert a color token from one color space to another";
  
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("token", {
      type: TokenColorSchema,
    });
    this.addInput("colorSpace", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
        default: "srgb",
      }
    });

    this.addOutput("token", {
      type: TokenColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { token, colorSpace } = this.getAllInputs();

    if (!colorSpaces.includes(colorSpace)) {
      throw new Error("Invalid color space: " + colorSpace);
    }

    if (!token || !token.value) {
      throw new Error("Invalid token or token has no color value");
    }

    const colObj = toColor(token.value);
    const convertedColor = toColorObject(colObj.to(colorSpace));

    const convertedToken = {
      ...token,
      value: convertedColor
    };

    this.setOutput("token", convertedToken);
  }
}
