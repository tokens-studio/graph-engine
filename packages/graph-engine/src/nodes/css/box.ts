import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'CSS Box';
	static type = 'studio.tokens.css.box';
	static description =
		'CSS Box node allows you to generate a CSS box from 4 values';

	declare inputs: ToInput<{
		top: number;
		right: number;
		bottom: number;
		left: number;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('top', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('right', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('bottom', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('left', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { top, right, bottom, left } = this.getAllInputs();
		this.setOutput('value', `${top} ${right} ${bottom} ${left}`);
	}
}
