import { AnySchema, BooleanSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Logical Not';
	static type = 'studio.tokens.logic.not';
	static description = 'Not node allows you to negate a boolean value.';

	declare inputs: ToInput<{
		value: T;
	}>;

	declare outputs: ToOutput<{
		value: boolean;
	}>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
    });
    this.addOutput("value", {
      type: BooleanSchema,
    });
  }

	execute(): void | Promise<void> {
		const { value } = this.getAllInputs();

		this.setOutput('value', !value);
	}
}
