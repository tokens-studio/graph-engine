// src/nodes/math/dataMapping.ts

import { BooleanSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, Node } from '../../programmatic/nodes/node.js';
import { ToInput, ToOutput } from '../../programmatic';

export default class RangeMappingNode extends Node {
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

		this.addInput('inputValue', {
			type: {
				...NumberSchema,
				default: 5
			}
		});
		this.addInput('inputMin', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('inputMax', {
			type: {
				...NumberSchema,
				default: 100
			}
		});
		this.addInput('outputMin', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('outputMax', {
			type: {
				...NumberSchema,
				default: 1
			}
		});
		this.addInput('clamp', {
			type: {
				...BooleanSchema,
				default: true
			}
		});

		this.addOutput('mappedValue', {
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
