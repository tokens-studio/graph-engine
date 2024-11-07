import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { setToPrecision } from '../../utils/precision.js';

type PowerValue = {
	index: number;
	value: number;
};

export default class NodeDefinition extends Node {
	static title = 'Power Series';
	static type = 'studio.tokens.series.power';
	static description =
		'Generates sequence based on powers (e.g., 2⁰, 2¹, 2², 2³...)';

	declare inputs: ToInput<{
		base: number;
		powers: number[];
		precision: number;
	}>;

	declare outputs: ToOutput<{
		array: number[];
		indexed: PowerValue[];
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('base', {
			type: {
				...NumberSchema,
				default: 2
			}
		});
		this.addInput('powers', {
			type: {
				...arrayOf(NumberSchema),
				default: [0, 1, 2, 3]
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
		const { base, powers, precision } = this.getAllInputs();
		const values: PowerValue[] = powers.map((power, index) => ({
			index,
			value: setToPrecision(Math.pow(base, power), precision)
		}));

		this.outputs.array.set(values.map(x => x.value));
	}
}
