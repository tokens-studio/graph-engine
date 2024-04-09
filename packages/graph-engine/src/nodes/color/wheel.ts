import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { ColorArraySchema, NumberSchema } from "@/schemas/index.js";
import chroma from "chroma-js";

export default class NodeDefinition extends Node {
  static title = "Color Wheel";
  static type = NodeTypes.WHEEL;
  static description =
    "Generate Color Wheel node allows you to create a color scale based on a base color and rotation in hue. You can use this node to generate a color scale for a specific color property.";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("hueAmount", {
      type: {
        ...NumberSchema,
        default: 360,
      },
    });
    this.addInput("hueAngle", {
      type: {
        ...NumberSchema,
        default: 180,
      },
      visible: true,
    });
    this.addInput("saturation", {
      type: {
        ...NumberSchema,
        default: 80,
      },
      visible: true,
    });
    this.addInput("lightness", {
      type: {
        ...NumberSchema,
        default: 50,
      },
      visible: true,
    });
    this.addInput("colors", {
      type: {
        ...NumberSchema,
        default: 8,
      },
      visible: true,
    });

    this.addOutput("value", {
      type: ColorArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { colors, hueAngle, hueAmount, saturation, lightness } =
      this.getAllInputs();

    const colorList: string[] = [];

    let step;
    for (step = 0; step < colors; step++) {
      const hue = hueAngle + (((step * hueAmount) / colors) % 360);
      const color = chroma.hsl(hue, saturation, lightness);
      colorList.push(color.hex());
    }
    this.setOutput("value", colorList);
  }
}
