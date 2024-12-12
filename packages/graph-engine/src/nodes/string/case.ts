import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';

export enum CaseType {
	CAMEL = 'camel',
	SNAKE = 'snake',
	KEBAB = 'kebab',
	PASCAL = 'pascal'
}

/**
 * This node converts strings between different case formats
 */
export default class NodeDefinition extends Node {
	static title = 'Case Convert';
	static type = 'studio.tokens.string.case';
	static description = 'Converts strings between different case formats';

	declare inputs: ToInput<{
		string: string;
		type: CaseType;
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
		this.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, type } = this.getAllInputs();

		// First normalize the string by splitting on word boundaries
		const words = string
			// Add space before capitals in camelCase/PascalCase, but handle consecutive capitals
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
			.replace(/([a-z\d])([A-Z])/g, '$1 $2')
			// Replace common delimiters with spaces
			.replace(/[-_.]/g, ' ')
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
