import {
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';

export default class NodeDefinition extends Node {
	static title = 'Numeric Scale';
	static type = 'studio.tokens.naming.numeric';
	static description =
		'Generates numeric scale with optional prefix, suffix, and multiplier';

	declare inputs: ToInput<{
		index: number;
		multiplier: number;
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
				description: 'index number for the scale'
			}
		});
		this.addInput('multiplier', {
			type: {
				...NumberSchema,
				default: 1,
				description: 'Multiplier for the index (e.g., 100 for ramps)'
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
		const { index, multiplier, prefix, suffix } = this.getAllInputs();
		const value = (index + 1) * multiplier;
		this.outputs.value.set(`${prefix}${value}${suffix}`);
	}
}
