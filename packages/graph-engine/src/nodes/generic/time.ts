import { INodeDefinition, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { NumberSchema } from '../../schemas/index.js';

/**
 * A node that returns the current time each tick in seconds since the Unix epoch.
 * When the node is started, it will update the time every second.
 */
export default class NodeDefinition extends Node {
	static title = 'Time';
	static type = 'studio.tokens.generic.time';
	static description = 'Provides the current time each tick';

	declare outputs: ToOutput<{
		value: number;
	}>;

	_interval: NodeJS.Timeout | null = null;
	constructor(props: INodeDefinition) {
		super(props);

		this.addOutput('value', {
			type: NumberSchema
		});
	}

	onStart = () => {
		if (this._interval) {
			clearInterval(this._interval);
		}
		this._interval = setInterval(() => {
			this.run();
		}, 1000);
	};
	onStop = () => {
		if (this._interval) {
			clearInterval(this._interval);
		}
	};

	execute(): void | Promise<void> {
		this.outputs.value.set(Date.now());
	}
}
