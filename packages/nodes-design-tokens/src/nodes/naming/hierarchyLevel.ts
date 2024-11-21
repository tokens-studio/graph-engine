import {
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';

const DEFAULT_LEVELS = [
	'primary',
	'secondary',
	'tertiary',
	'quaternary',
	'quinary',
	'senary',
	'septenary',
	'octonary',
	'nonary',
	'denary'
];

export default class NodeDefinition extends Node {
	static title = 'Hierarchy Level';
	static type = 'studio.tokens.naming.hierarchyLevel';
	static description =
		'Generates hierarchical level names (primary through denary)';

	declare inputs: ToInput<{
		index: number;
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
				description: 'Level index (0 = primary, 1 = secondary, etc.)'
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
		const { index, prefix, suffix } = this.getAllInputs();
		const clampedIndex = Math.max(
			0,
			Math.min(DEFAULT_LEVELS.length - 1, index)
		);
		const value = DEFAULT_LEVELS[clampedIndex];
		this.outputs.value.set(`${prefix}${value}${suffix}`);
	}
}
