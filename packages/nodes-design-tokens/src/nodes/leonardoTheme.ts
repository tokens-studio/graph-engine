import { BackgroundColor, Color, Theme } from "@adobe/leonardo-contrast-colors";
import {
  ColorSchema,
  INodeDefinition,
  Node,
  NumberSchema,
} from "@tokens-studio/graph-engine";
import { LeonardoColorSchema } from "../schemas/index.js";
import { arrayOf } from "../schemas/utils.js";

export default class LeonardoThemeNode extends Node {
  static title = "Leonardo Theme";
  static type = "studio.tokens.design.leonardo.theme";
  static description = "Creates a leonardo theme";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("colors", {
      type: arrayOf(LeonardoColorSchema),
      visible: true,
    });
    this.addInput("contrast", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("lightness", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("saturation", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("backgroundColor", {
      type: LeonardoColorSchema,
      visible: true,
    });

    this.addOutput("colors", {
      type: arrayOf(ColorSchema),
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { backgroundColor, colors, contrast, saturation, lightness } =
      this.getAllInputs();

    const theme = new Theme({
      colors: colors.map((x) => new Color(x)),
      contrast,
      saturation,
      backgroundColor: new BackgroundColor(backgroundColor),
      lightness,
    });

    this.setOutput("colors", theme.contrastColorValues);
  }
}
