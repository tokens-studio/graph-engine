import { ColorSchema, NumberSchema, StringSchema } from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import Color from 'colorjs.io';

export const colorSpaces = [
  "Lab",
  "ICtCp",
  "Jzazbz",
] as const;

export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Distance";
  static type = "studio.tokens.color.distance";
  static description =
    "Calculate the distance between two colors. The output is a number representing the difference between the two colors. The lower the number, the closer the colors are to each other. The output is based on the CIEDE2000 color difference formula.";

  declare inputs: ToInput<{
    colorA: ColorType;
    colorB: ColorType;
    precision: number;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("colorA", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("colorB", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
    });
    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 4,
      },
    });
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
        default: "Lab",
      },
    });

    this.addOutput("value", {
      type: NumberSchema,
    });
  }

	execute(): void | Promise<void> {
		const { color1, color2 } = this.getAllInputs();

		let c1;
		let c2;
		try {
			c1 = new Color(color1);
			c2 = new Color(color2);
		} catch (e) {
			throw new Error('Invalid color inputs');
		}

		const distance = Color.deltaE(c1, c2, 'CMC');

		this.setOutput('value', distance);
	}
}
