import { ControlFlowNode, INodeDefinition } from '../../index.js';
import { ToControlInput } from '../../programmatic/controlflow/input.js';
import { ToControlOutput } from '../../programmatic/controlflow/output.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition<T> extends ControlFlowNode {
	static title = 'Passthrough Message';
	static type = 'studio.tokens.network.passthrough';
	static description = 'Passes a value through to the output';

	declare inputs: ToControlInput<{
		value: T;
	}>;
	declare outputs: ToControlOutput<{
		value: T;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.controlflow.addInput<T>('value', (val, type) => {
			this.outputs.value.trigger(val, type);
		});
		this.controlflow.addOutput('value');
	}
}
