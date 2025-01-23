import { Black, toColor } from './lib/utils.js';
import { Color } from '../../../types.js';
import { ColorSchema, StringSchema } from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Color to string';
	static type = 'studio.tokens.color.colorToString';
	static description = 'Converts a color to a string';

	declare inputs: ToInput<{
		color: Color;
		space: 'srgb' | 'hsl' | 'hex';
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('color', {
			type: {
				...ColorSchema,
				default: Black
			}
		});
		this.addInput('space', {
			type: {
				...StringSchema,
				enum: ['srgb', 'hsl', 'hex'],
				default: 'hex'
			},
			visible: false
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		// eslint-disable-next-line prefer-const
		const { color, space } = this.getAllInputs();

		let adjustedSpace: string = space;
		let format: { format: string } | undefined = undefined;

		if (space == 'hex') {
			adjustedSpace = 'srgb';
			format = {
				format: 'hex'
			};
		}

		const col = toColor(color).to(adjustedSpace).toString(format);
		this.outputs.value.set(col);
	}
}
