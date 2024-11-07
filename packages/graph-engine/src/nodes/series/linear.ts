import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type LinearValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
	static title = 'Linear Space';
	static type = 'studio.tokens.series.linear';
	static description =
		'Creates evenly spaced numbers over a specified interval';

	declare inputs: ToInput<{
		start: number;
		stop: number;
		count: number;
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: LinearValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('start', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('stop', {
			type: {
				...NumberSchema,
				default: 1
			}
		});
		this.addInput('count', {
			type: {
				...NumberSchema,
				default: 5
			}
		});
		this.addInput('precision', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addOutput('array', {
			type: arrayOf(NumberSchema)
		});
	}

	execute(): void | Promise<void> {
		const { start, stop, count, precision } = this.getAllInputs();
		const values: LinearValue[] = [];

		if (count <= 1) {
			values.push({
				index: 0,
				value: setToPrecision(start, precision)
			});
		} else {
			const step = (stop - start) / (count - 1);
			for (let i = 0; i < count; i++) {
				values.push({
					index: i,
					value: setToPrecision(start + step * i, precision)
				});
			}
		}

		this.outputs.array.set(values.map(x => x.value));
	}
}
