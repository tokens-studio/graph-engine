import {
	BooleanSchema,
	ColorSchema,
	NumberSchema,
	StringSchema
} from '../../schemas/index.js';
import { ContrastAlgorithm } from '../../types/index.js';
import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition } from '../../index.js';
import { toColor } from './lib/utils.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Contrast';
	static type = 'studio.tokens.color.contrast';
	static description =
		'Calculates the contrast between two color values. The output is a number representing the contrast ratio between the two colors. The higher the number, the higher the contrast between the two colors. The output is based on the APCA-W3 contrast calculation.';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('a', {
			type: {
				...ColorSchema,
				default: '#000000'
			}
		});
		this.dataflow.addInput('b', {
			type: {
				...ColorSchema,
				default: '#ffffff'
			}
		});
		this.dataflow.addInput('algorithm', {
			type: {
				...StringSchema,
				enum: Object.values(ContrastAlgorithm),
				default: ContrastAlgorithm.APCA
			}
		});
		this.dataflow.addInput('absolute', {
			type: {
				...BooleanSchema,
				default: false
			}
		});

		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b, algorithm, absolute } = this.getAllInputs();
		const color = toColor(a);
		const background = toColor(b);

		const calculated = background.contrast(color, algorithm);

		this.outputs.value.set(absolute ? Math.abs(calculated) : calculated);
	}
}
