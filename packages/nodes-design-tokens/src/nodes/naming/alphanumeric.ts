import {
	BooleanSchema,
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default class NodeDefinition extends Node {
	static title = 'Alphanumeric Scale';
	static type = 'studio.tokens.naming.alphanumeric';
	static description = 'Generates alphanumeric scale (A1, A2, B1, B2, etc.)';

	declare inputs: ToInput<{
		letterIndex: number;
		numberIndex: number;
		uppercase: boolean;
		prefix: string;
		suffix: string;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('letterIndex', {
			type: {
				...NumberSchema,
				default: 0,
				description: 'Letter index (0 = A, 1 = B, etc.)'
			}
		});
		this.addInput('numberIndex', {
			type: {
				...NumberSchema,
				default: 0,
				description: 'Number index (0 = 1, 1 = 2, etc.)'
			}
		});
		this.addInput('uppercase', {
			type: {
				...BooleanSchema,
				default: false,
				description: 'Output letter in uppercase (true) or lowercase (false)'
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
		const { letterIndex, numberIndex, uppercase, prefix, suffix } =
			this.getAllInputs();
		const clampedLetterIndex = Math.max(
			0,
			Math.min(LETTERS.length - 1, letterIndex)
		);
		let letter = LETTERS[clampedLetterIndex];
		if (!uppercase) {
			letter = letter.toLowerCase();
		}
		const number = Math.max(1, numberIndex + 1);
		this.outputs.value.set(`${prefix}${letter}${number}${suffix}`);
	}
}
