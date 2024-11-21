import {
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { SCHEMAS, SchemaType } from '../utils/sizeScales.js';

export default class NodeDefinition extends Node {
	static title = 'T-Shirt Size';
	static type = 'studio.tokens.naming.tshirtSize';
	static description =
		'Generates t-shirt size naming with support for extended scales';

	declare inputs: ToInput<{
		index: number;
		baseIndex: number;
		schema: SchemaType;
		prefix: string;
		suffix: string;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('index', {
			type: {
				...NumberSchema,
				default: 0,
				description:
					'Position relative to base index (negative for smaller sizes)'
			}
		});
		this.addInput('baseIndex', {
			type: {
				...NumberSchema,
				default: 0,
				description:
					'Index in the sequence that represents the base size (md/m/medium)'
			}
		});
		this.addInput('schema', {
			type: {
				...StringSchema,
				default: 'default',
				enum: Object.keys(SCHEMAS),
				description: 'Naming schema to use (default, short, or long)'
			}
		});
		this.addInput('prefix', {
			type: {
				...StringSchema,
				default: '',
				description: 'Optional prefix for the output'
			}
		});
		this.addInput('suffix', {
			type: {
				...StringSchema,
				default: '',
				description: 'Optional suffix for the output'
			}
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { index, baseIndex, schema, prefix, suffix } = this.getAllInputs();

		const sizes = SCHEMAS[schema];
		const middleIndex = Math.floor(sizes.length / 2);
		const relativeIndex = index - baseIndex;
		const targetIndex = middleIndex + relativeIndex;
		const clampedIndex = Math.max(0, Math.min(sizes.length - 1, targetIndex));

		this.outputs.value.set(`${prefix}${sizes[clampedIndex]}${suffix}`);
	}
}
