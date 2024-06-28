// src/nodes/color/nameToColor.ts

import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";
import Color from "colorjs.io";

export default class NameToColorNode extends Node {
  static title = "Name to Color";
  static type = "studio.tokens.color.nameToColor";
  static description = "Generates a consistent color based on a name or text input";

  declare inputs: ToInput<{
    name: string;
    saturation: number;
    lightness: number;
  }>;

  declare outputs: ToOutput<{
    color: string;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("name", {
      type: StringSchema,
    });
    this.addInput("saturation", {
      type: {
        ...NumberSchema,
        default: 70,
        minimum: 0,
        maximum: 100,
      },
    });
    this.addInput("lightness", {
      type: {
        ...NumberSchema,
        default: 50,
        minimum: 0,
        maximum: 100,
      },
    });

    this.addOutput("color", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { name, saturation, lightness } = this.getAllInputs();

    const hue = this.nameToHue(name);
    const color = new Color("hsl", [hue, saturation, lightness]);

    this.setOutput("color", color.to("srgb").toString({format: "hex"}));
  }

  private nameToHue(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash % 360;
  }
}