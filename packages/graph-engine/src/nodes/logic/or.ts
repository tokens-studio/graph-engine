import {
	AnySchema,
	BooleanSchema,
	createVariadicSchema
} from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

export default class NodeDefinition<T> extends Node {
	static title = 'Logical or';
	static type = 'studio.tokens.logic.or';
	static description = 'OR node allows you to check if all inputs are true.';

	declare inputs: ToInput<{
		value: T;
	}>;

	declare outputs: ToOutput<{
		value: boolean;
	}>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("inputs", {
      type: {
        ...createVariadicSchema(AnySchema),
        default: [],
      },
      variadic: true,
    });
    this.addOutput("value", {
      type: BooleanSchema,
    });
  }

	execute(): void | Promise<void> {
		const inputs = this.getInput('inputs') as number[];
		const output = inputs.reduce((acc, curr) => acc || !!curr, false);
		this.setOutput('value', output);
	}
}
