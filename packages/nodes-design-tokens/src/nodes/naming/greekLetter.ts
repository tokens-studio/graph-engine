import {
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';

const DEFAULT_LETTERS = [
	'alpha',
	'beta',
	'gamma',
	'delta',
	'epsilon',
	'zeta',
	'eta',
	'theta',
	'iota',
	'kappa',
	'lambda',
	'mu',
	'nu',
	'xi',
	'omicron',
	'pi',
	'rho',
	'sigma',
	'tau',
	'upsilon',
	'phi',
	'chi',
	'psi',
	'omega'
];

export default class NodeDefinition extends Node {
	static title = 'Greek Letter';
	static type = 'studio.tokens.naming.greekLetter';
	static description = 'Generates Greek letter names (alpha through omega)';

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
				description: 'Letter index (0 = alpha, 1 = beta, etc.)'
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
			Math.min(DEFAULT_LETTERS.length - 1, index)
		);
		const value = DEFAULT_LETTERS[clampedIndex];
		this.outputs.value.set(`${prefix}${value}${suffix}`);
	}
}
