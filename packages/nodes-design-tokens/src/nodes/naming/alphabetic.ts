import {
	BooleanSchema,
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';

const DEFAULT_LETTERS = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];

export default class NodeDefinition extends Node {
	static title = 'Alphabetic Scale';
	static type = 'studio.tokens.naming.alphabetic';
	static description = 'Generates alphabetic scale (A through Z)';

	declare inputs: ToInput<{
		index: number;
		uppercase: boolean;
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
				description: 'Letter index (0 = A, 1 = B, etc.)'
			}
		});
		this.addInput('uppercase', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Output in uppercase (true) or lowercase (false)'
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
		const { index, uppercase, prefix, suffix } = this.getAllInputs();
		const clampedIndex = Math.max(
			0,
			Math.min(DEFAULT_LETTERS.length - 1, index)
		);
		let value = DEFAULT_LETTERS[clampedIndex];
		if (!uppercase) {
			value = value.toLowerCase();
		}
		this.outputs.value.set(`${prefix}${value}${suffix}`);
	}
}
