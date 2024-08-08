import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export enum Position {
	START = 'start',
	END = 'end'
}

/**
 * This node pads a string to a given length
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Pad';
	static type = 'studio.tokens.string.pad';
	static description = 'Pads a string to a given length';

	declare inputs: ToInput<{
		string: string;
		length: number;
		character: string;
		position: Position;
	}>;
	declare outputs: ToOutput<{
		string: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('string', {
			type: StringSchema
		});
		this.dataflow.addInput('length', {
			type: NumberSchema
		});
		this.dataflow.addInput('character', {
			type: StringSchema
		});
		this.dataflow.addInput('position', {
			type: {
				...StringSchema,
				enum: [Position.START, Position.END],
				default: Position.START
			}
		});
		this.dataflow.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, length, character, position } = this.getAllInputs();

		let paddedString: string;

		if (position === Position.START) {
			paddedString = string.padStart(length, character[0]);
		} else {
			paddedString = string.padEnd(length, character[0]);
		}

		this.outputs.string.set(paddedString);
	}
}