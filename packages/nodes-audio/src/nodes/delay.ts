import { AudioBaseNode } from './base.js';
import {
	INodeDefinition,
	NumberSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { NodeSchema } from '../schemas/index.js';

export class AudioDelayNode extends AudioBaseNode {
	static title = 'Audio Delay node';
	static type = 'studio.tokens.audio.delay';

	audioNode: DelayNode | undefined;
	_last: AudioNode | undefined;

	declare inputs: ToInput<{
		delay: number;
		input: AudioNode | undefined;
	}>;

	declare outputs: ToOutput<{
		node: AudioNode;
	}>;

	static description = 'Modifies an audio source to provide delay.';
	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('delay', {
			type: {
				...NumberSchema,
				default: 1,
				minimum: 1,
				maximum: 180
			},
			visible: true,
			annotations: {
				'ui.control': 'slider'
			}
		});
		this.dataflow.addInput('input', {
			type: NodeSchema,
			visible: true
		});

		this.dataflow.addOutput('node', {
			visible: true,
			type: {
				...NodeSchema,
				description: 'The created Node'
			}
		});
	}

	execute(): void | Promise<void> {
		const context = this.getAudioCtx();
		const { input, delay } = this.getAllInputs();

		if (!this.audioNode) {
			this.audioNode = context.createDelay(delay);
		}

		if (this._last) {
			this._last.disconnect(this.audioNode!);
			this._last = undefined;
		}

		if (input) {
			input.connect(this.audioNode);
			this._last = input;
		}

		this.audioNode.delayTime.setValueAtTime(delay, context.currentTime);
		this.outputs.node.set(this.audioNode);
	}
}
