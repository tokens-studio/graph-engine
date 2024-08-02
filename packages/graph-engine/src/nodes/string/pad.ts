import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export enum Position {
	START = 'start',
	END = 'end'
}

/**
 * This node pads a string to a given length
 */
export default class NodeDefinition extends Node {
	static title = 'Pad';
	static type = 'studio.tokens.string.pad';
	static description = 'Pads a string to a given length';

	declare inputs: ToInput<{
		value: string;
		length: number;
		character: string;
		position: Position;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('string', {
			type: StringSchema
		});
		this.addInput('length', {
			type: NumberSchema
		});
		this.addInput('character', {
			type: StringSchema
		});
		this.addInput('position', {
			type: {
				...StringSchema,
				enum: [Position.START, Position.END],
				default: Position.START
			}
		});
		this.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, length, character, position } = this.getAllInputs();

		let paddedString: string;

		if (position === Position.START) {
			paddedString = string.padStart(length, character);
		} else {
			paddedString = string.padEnd(length, character);
		}

		this.setOutput('string', paddedString);
	}
}
