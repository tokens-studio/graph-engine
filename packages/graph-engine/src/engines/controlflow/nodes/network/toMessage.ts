import {
	AnySchema,
	Dataflow,
	IDataflowNode,
	INodeDefinition,
	ToInput
} from '../../index.js';
import {
	ControlFlow,
	IControlFlowNode
} from '@/engines/controlflow/types/node.js';
import { Node } from '../../programmatic/nodes/node.js';
import { ToControlInput } from '@/programmatic/controlflow/input.js';
import { ToControlOutput } from '@/programmatic/controlflow/output.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T>
	extends Node
	implements IControlFlowNode, IDataflowNode
{
	controlflow = new ControlFlow(this);
	dataflow = new Dataflow(this);

	static title = 'To message';
	static type = 'studio.tokens.network.toMsg';
	static description =
		'When triggered, it will take the dataflow input and pass it to the controlflow output';

	declare inputs: ToControlInput<{
		trigger: void;
	}> &
		ToInput<{
			value: T;
		}>;
	declare outputs: ToControlOutput<{
		value: T;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('value', {
			type: AnySchema
		});

		this.controlflow.addInput('trigger', () => {
			this.outputs.value.trigger(
				this.inputs.value.value,
				this.inputs.value.type
			);
		});

		this.controlflow.addOutput('value');
	}
	execute() {}
}
