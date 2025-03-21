import {
	AnySchema,
	Dataflow,
	IDataflowNode,
	INodeDefinition,
	ToOutput
} from '../../index.js';
import {
	ControlFlow,
	IControlFlowNode
} from '@/engines/controlflow/types/node.js';
import { Node } from '../../programmatic/nodes/node.js';
import { ToControlInput } from '@/programmatic/controlflow/input.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T>
	extends Node
	implements IControlFlowNode, IDataflowNode
{
	controlflow = new ControlFlow(this);
	dataflow = new Dataflow(this);

	static title = 'Hold';
	static type = 'studio.tokens.network.hold';
	static description = 'Holds a message and makes it available for dataflow';

	declare inputs: ToControlInput<{
		value: T;
	}>;
	declare outputs: ToOutput<{
		value: T;
	}>;

	_interval: NodeJS.Timer | null = null;
	constructor(props: INodeDefinition) {
		super(props);
		this.controlflow.addInput('value', (val, type) => {
			this.outputs.value.set(val, type);
			//Trigger the dataflow so it knows it can update
			this.run();
		});
		this.addOutput('value', { type: AnySchema });
	}
	execute() {}
}
