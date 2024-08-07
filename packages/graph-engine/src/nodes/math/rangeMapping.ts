// src/nodes/math/dataMapping.ts

import { BooleanSchema, NumberSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { ToInput, ToOutput } from '@/programmatic/index.js';

export default class RangeMappingNode extends DataflowNode {
	static title = 'Range Mapping';
	static type = 'studio.tokens.math.dataMapping';
	static description = 'Maps a value from one range to another';

	declare inputs: ToInput<{
		inputValue: number;
		inputMin: number;
		inputMax: number;
		outputMin: number;
		outputMax: number;
		clamp: boolean;
	}>;

	declare outputs: ToOutput<{
		mappedValue: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('inputValue', {
			type: {
				...NumberSchema,
				default: 5
			}
		});
		this.dataflow.addInput('inputMin', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addInput('inputMax', {
			type: {
				...NumberSchema,
				default: 100
			}
		});
		this.dataflow.addInput('outputMin', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.dataflow.addInput('outputMax', {
			type: {
				...NumberSchema,
				default: 1
			}
		});
		this.dataflow.addInput('clamp', {
			type: {
				...BooleanSchema,
				default: true
			}
		});

		this.dataflow.addOutput('mappedValue', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { inputValue, inputMin, inputMax, outputMin, outputMax, clamp } =
			this.getAllInputs();

		// Avoid division by zero
		if (inputMin === inputMax) {
			throw new Error('inputMin and inputMax cannot be the same value');
		}

		let mappedValue =
			((inputValue - inputMin) / (inputMax - inputMin)) *
				(outputMax - outputMin) +
			outputMin;

		if (clamp) {
			mappedValue = Math.min(
				Math.max(mappedValue, Math.min(outputMin, outputMax)),
				Math.max(outputMin, outputMax)
			);
		}

		this.outputs.mappedValue.set(mappedValue);
	}
}
