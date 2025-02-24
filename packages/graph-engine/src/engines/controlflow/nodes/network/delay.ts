import {
	ControlFlow,
	IControlFlowNode
} from '@/engines/controlflow/types/node.js';
import {
	Dataflow,
	IDataflowNode,
	INodeDefinition,
	NumberSchema,
	ToInput
} from '../../index.js';
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

	static title = 'Delay';
	static type = 'studio.tokens.network.delay';
	static description =
		'When trigger, it will output the provided value after a delay';

	declare inputs: ToControlInput<{
		value: T;
	}> &
		ToInput<{
			/**
			 * The delay in milliseconds
			 * @default 1000
			 */
			delay: number;
		}>;
	declare outputs: ToControlOutput<{
		value: T;
	}>;

	_interval: NodeJS.Timer | null = null;
	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('delay', {
			type: NumberSchema
		});

		this.controlflow.addInput('value', (val, type) => {
			setTimeout(() => {
				this.outputs.value.trigger(val, type);
			}, this.inputs.delay.value);
		});

		this.controlflow.addOutput('value');
	}
	execute() {}
}
