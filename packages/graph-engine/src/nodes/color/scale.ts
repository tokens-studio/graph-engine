import { ColorSchema, NumberSchema } from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import Color from 'colorjs.io';

export default class NodeDefinition extends Node {
	static title = 'Scale colors';
	static type = 'studio.tokens.color.scale';
	static description = '';

	declare inputs: ToInput<{
		color: ColorType;
		stepsUp: number;
		stepsDown: number;
	}>;
	declare outputs: ToOutput<{
		value: ColorType[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: ColorSchema
		});
		this.addInput('stepsUp', {
			type: NumberSchema
		});
		this.addInput('stepsDown', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: arrayOf(ColorSchema)
		});
	}

	execute(): void | Promise<void> {
		const { stepsUp, stepsDown, color } = this.getAllInputs();

		const col = new Color(color);

		const sUp = Math.max(0, stepsUp) + 2;
		const sDown = Math.max(0, stepsDown) + 2;

		const lighter = col
			.steps('white', { space: 'hsl', steps: sUp })
			.slice(1, -1);
		const darker = col
			.steps('black', { space: 'hsl', steps: sDown })
			.slice(1, -1);
		const mid = [col.toString({ format: 'hex' })];

		const final = ([] as string[]).concat(lighter, mid, darker) as string[];
		this.setOutput('value', final);
	}
}
