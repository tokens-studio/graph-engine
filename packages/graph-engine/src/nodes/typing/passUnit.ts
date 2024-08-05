import valueParser from 'postcss-value-parser-esm';

import { INodeDefinition, Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';
import { ToInput } from '../../programmatic/input.js';
import { ToOutput } from '../../programmatic/output.js';

export default class NodeDefinition extends Node {
	static title = 'Pass unit';
	static type = 'studio.tokens.typing.passUnit';
	declare inputs: ToInput<{
		value: string;
		fallback: string;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;
	static description = "Adds a unit to a value if it doesn't already have one";
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: StringSchema
		});
		this.addInput('fallback', {
			type: {
				...StringSchema,
				default: 'px'
			}
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { value, fallback } = this.getAllInputs();

		const x = valueParser.unit(value);
		if (!x) {
			throw Error('Could not parse unit');
		}

		if (x.unit) {
			this.outputs.value.set(value);
		} else {
			this.outputs.value.set(`${value}${fallback || ''}`);
		}
	}
}
