import { ColorSchema, StringSchema } from '../../schemas/index.js';
import { Color as ColorType } from '../../types.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { toColorObject } from './lib/utils.js';
import Color from 'colorjs.io';
export { ColorModifierTypes } from '@tokens-studio/types';

export default class NodeDefinition extends DataflowNode {
	static title = 'String to Color';
	static type = 'studio.tokens.color.strToColor';
	static description = 'Parses a string to a color';

	declare inputs: ToInput<{
		color: string;
	}>;

	declare outputs: ToOutput<{
		color: ColorType;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: StringSchema
		});

		this.addOutput('color', {
			type: ColorSchema
		});
	}

	execute(): void | Promise<void> {
		const { color } = this.getAllInputs();

		this.outputs.color.set(toColorObject(new Color(color as string)));
	}
}
