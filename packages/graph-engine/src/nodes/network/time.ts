import { ControlFlowNode } from '@/programmatic/nodes/controlflow.js';
import {
	ControlFlowOutput,
	ToControlOutput
} from '@/programmatic/controlflow/output.js';
import { INodeDefinition, NumberSchema } from '../../index.js';

/**
 * A node that returns the current time each tick in seconds since the Unix epoch.
 * When the node is started, it will update the time every second.
 */
export default class NodeDefinition extends ControlFlowNode {
	static title = 'Time';
	static type = 'studio.tokens.network.time';
	static description =
		'Provides the current time each tick once the graph is started';

	declare outputs: ToControlOutput<{
		value: number;
	}>;

	_interval: NodeJS.Timeout | null = null;
	constructor(props: INodeDefinition) {
		super(props);

		this.controlflow.onStart = () => {
			if (this._interval) {
				clearInterval(this._interval);
			}
			this._interval = setInterval(() => {
				this.outputs.value.trigger(Date.now());
			}, 1000);
		};
		this.controlflow.onStop = () => {
			if (this._interval) {
				clearInterval(this._interval);
			}
		};

		this.outputs.value = new ControlFlowOutput({
			name: 'value',
			node: this,
			type: NumberSchema
		});
	}
}
