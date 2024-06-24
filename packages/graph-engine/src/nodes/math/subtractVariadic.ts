import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, createVariadicSchema } from '../../schemas/index.js';

export default class NodeDefinition extends Node {
	static title = 'Subtract (Variadic)';
	static type = 'studio.tokens.math.subtractVariadic';
	static description = 'Allows you to subtract two or more numbers.';

	declare inputs: ToInput<{
		inputs: number[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("inputs", {
      type: {
        ...createVariadicSchema(NumberSchema),
        default: [],
      },
      variadic: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
    });
  }

	execute(): void | Promise<void> {
		const inputs = this.getInput('inputs') as number[];
		const [start, ...rest] = inputs;
		const output = rest.reduce((acc, x) => acc - x, start);
		this.setOutput('value', output);
	}
}
