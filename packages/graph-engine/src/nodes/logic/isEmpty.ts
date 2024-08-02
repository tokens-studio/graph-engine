import { AnySchema, BooleanSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';


export default class NodeDefinition<T> extends Node {
	static title = 'Is Empty';
	static type = 'studio.tokens.logic.isEmpty';
	static description = 'Checks if a value is empty';

	declare inputs: ToInput<{
		value: T;
	}>;
	declare outputs: ToOutput<{
		isEmpty: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnySchema
		});

		this.addOutput('isEmpty', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

    if(value === null || value === undefined || value === '') {
      this.setOutput('isEmpty', true);
    } else {
      this.setOutput('isEmpty', false);
    }
	}
}
