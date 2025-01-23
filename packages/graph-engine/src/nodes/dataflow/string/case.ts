import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export enum CaseType {
	CAMEL = 'camel',
	SNAKE = 'snake',
	KEBAB = 'kebab',
	PASCAL = 'pascal'
}

/**
 * This node converts strings between different case formats
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Case Convert';
	static type = 'studio.tokens.string.case';
	static description = 'Converts strings between different case formats';

	declare inputs: ToInput<{
		string: string;
		type: CaseType;
		/**
		 * Characters to be replaced with spaces. Default: -_.
		 * @default "-_."
		 */
		delimiters: string;
	}>;
	declare outputs: ToOutput<{
		string: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('string', {
			type: StringSchema
		});
		this.addInput('type', {
			type: {
				...StringSchema,
				enum: Object.values(CaseType),
				default: CaseType.CAMEL
			}
		});
		this.addInput('delimiters', {
			type: {
				...StringSchema,
				default: '-_.'
			}
		});
		this.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, type, delimiters } = this.getAllInputs();

		// Replace each delimiter with a space
		const processedString = delimiters
			.split('')
			.reduce((result, char) => result.replaceAll(char, ' '), string);

		// First normalize the string by splitting on word boundaries
		const words = processedString
			// Add space before capitals in camelCase/PascalCase
			.split(/([A-Z][a-z]+)/)
			.join(' ')
			// Remove extra spaces and convert to lowercase
			.trim()
			.toLowerCase()
			// Split into words and remove empty strings
			.split(/\s+/)
			.filter(word => word.length > 0);

		let result: string;
		switch (type) {
			case CaseType.CAMEL:
				result = words[0] + words.slice(1).map(capitalize).join('');
				break;
			case CaseType.SNAKE:
				result = words.join('_');
				break;
			case CaseType.KEBAB:
				result = words.join('-');
				break;
			case CaseType.PASCAL:
				result = words.map(capitalize).join('');
				break;
			default:
				result = string;
		}

		this.outputs.string.set(result);
	}
}

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
