import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { StringSchema } from '../../schemas/index.js';
import cssFunctionsData from 'mdn-data/css/functions.json' with { type: 'json' };

const FUNCTION_NAMES = Object.keys(cssFunctionsData);

export default class NodeDefinition extends DataflowNode {
	static title = 'CSS Function';
	static type = 'studio.tokens.css.function';
	static description = 'Applies a CSS function to the value';

	declare inputs: ToInput<{
		functionName: keyof typeof cssFunctionsData;
		value: string;
	}>;

	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('functionName', {
			type: {
				...StringSchema,
				enum: FUNCTION_NAMES
			}
		});
		this.dataflow.addInput('value', {
			type: StringSchema
		});
		this.dataflow.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { functionName, value } = this.getAllInputs();
		this.outputs.value.set(functionName.replace('()', `(${value})`));
	}
}
