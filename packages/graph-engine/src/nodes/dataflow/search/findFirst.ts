import {
	BooleanSchema,
	NumberSchema,
	StringSchema
} from '../../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { Operator } from '../../../schemas/operators.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';
import { arrayOf } from '../../../schemas/utils.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Find First Match';
	static type = 'studio.tokens.search.findFirst';
	static description =
		'Finds the first array element that matches a comparison condition with a target value';

	declare inputs: ToInput<{
		array: any[];
		target: number;
		operator: Operator.GREATER_THAN | Operator.LESS_THAN;
	}>;

	declare outputs: ToOutput<{
		value: any;
		index: number;
		found: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('array', {
			type: {
				...arrayOf(NumberSchema),
				description: 'Array of numbers to search through'
			}
		});

		this.addInput('target', {
			type: {
				...NumberSchema,
				description: 'Target value to compare against'
			}
		});

		this.addInput('operator', {
			type: {
				...StringSchema,
				enum: [Operator.GREATER_THAN, Operator.LESS_THAN],
				default: Operator.GREATER_THAN,
				description: 'Comparison operator to use (greater than or less than)'
			}
		});

		this.addOutput('value', {
			type: {
				...NumberSchema,
				description: 'The first matching value found (null if no match)'
			}
		});

		this.addOutput('index', {
			type: {
				...NumberSchema,
				description: 'Index of the first matching value (-1 if no match)'
			}
		});

		this.addOutput('found', {
			type: {
				...BooleanSchema,
				description: 'Whether a matching value was found'
			}
		});
	}

	execute(): void {
		const { array, target, operator } = this.getAllInputs();

		const comparisonFn =
			operator === Operator.GREATER_THAN
				? (value: number) => value > target
				: (value: number) => value < target;

		const index = array.findIndex(comparisonFn);
		const found = index !== -1;
		const value = found ? array[index] : undefined;

		this.outputs.value.set(value);
		this.outputs.index.set(index);
		this.outputs.found.set(found);
	}
}
