import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { ObjectSchema } from '../../schemas/index.js';
import { ToInput } from '../../programmatic/dataflow/input.js';
import { ToOutput } from '../../programmatic/dataflow/output.js';
import { annotatedDynamicInputs } from '../../annotations/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Objectify';
	static type = 'studio.tokens.generic.objectify';
	static description =
		'Objectify node allows you to convert multiple inputs to an object.';

	declare inputs: ToInput<{
		[key: string]: unknown;
	}>;
	declare outputs: ToOutput<{
		value: Record<string, unknown>;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.annotations[annotatedDynamicInputs] = true;
		//Purely runtime inputs
		this.addOutput('value', {
			type: ObjectSchema
		});
	}

	execute(): void | Promise<void> {
		const finalType = {
			...ObjectSchema,
			properties: {}
		};

		const { value, schema } = Object.entries(this.inputs).reduce(
			(acc, [key, input]) => {
				acc.value[key] = input.value;
				acc.schema.properties[key] = input.type;
				return acc;
			},
			{
				value: {},
				schema: finalType
			}
		);
		this.outputs.value.set(value, schema);
	}
}
