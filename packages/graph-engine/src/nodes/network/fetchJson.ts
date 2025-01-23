import {
	ControlFlow,
	IControlFlowNode
} from '@/programmatic/nodes/controlflow.js';
import {
	Dataflow,
	IDataflowNode,
	INodeDefinition,
	ObjectSchema,
	StringSchema
} from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { ToControlInput } from '@/programmatic/controlflow/input.js';
import { ToControlOutput } from '@/programmatic/controlflow/output.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import axios from 'axios';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition
	extends Node
	implements IControlFlowNode, IDataflowNode
{
	controlflow = new ControlFlow(this);
	dataflow = new Dataflow(this);

	static title = 'Fetch Json';
	static type = 'studio.tokens.network.fetchJson';
	static description = 'Fetches a JSON value from the internet';

	declare inputs: ToControlInput<{
		trigger: any;
	}> &
		ToInput<{
			uri: string;
		}>;
	declare outputs: ToControlOutput<{
		value: any;
	}>;
	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('uri', {
			type: StringSchema
		});

		this.controlflow.addInput('trigger', async () => {
			const response = await axios.get(this.inputs.uri.value);
			this.outputs.value.trigger(response.data, ObjectSchema);
		});
		this.controlflow.addOutput('value');
	}
	execute() {}
}
