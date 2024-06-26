import { INodeDefinition, Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';
import { ToInput } from '../../programmatic/input.js';
import { ToOutput } from '../../programmatic/index.js';

export default class NodeDefinition extends Node {
  static title = "Split String";
  static type = "studio.tokens.string.split";
  declare inputs: ToInput<{
    value: string;
    separator: string;
  }>;
  declare outputs: ToOutput<{
    value: string;
  }>;
  static description = "Converts a string to lowercase";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: ",",
      },
    });
    this.addOutput("value", {
      type: StringSchema,
    });
  }

	execute(): void | Promise<void> {
		const { value, separator } = this.getAllInputs();
		if (separator === undefined) {
			this.setOutput('value', [value]);
		} else {
			this.setOutput('value', value.split(separator));
		}
	}
}
