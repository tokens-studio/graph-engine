import { ControlFlowNode, INodeDefinition } from '../../index.js';
import { ToControlOutput } from '../../programmatic/controlflow/output.js';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition extends ControlFlowNode {
	static title = 'Start';
	static type = 'studio.tokens.network.start';
	static description = 'Sends a pulse whenever the graph is started';

	declare outputs: ToControlOutput<{
		trigger: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.controlflow.addOutput('trigger');
		this.controlflow.onStart = () => {
			this.outputs.trigger.trigger(Date.now());
		};
		//We do not resume , we only trigger on start
		this.controlflow.onResume = () => {};
	}
}
