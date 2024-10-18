import { AudioBaseNode } from './base.js';
import { AudioBufferSchema, NodeSchema } from '../schemas/index.js';
import {
	BooleanSchema,
	INodeDefinition,
	ToInput
} from '@tokens-studio/graph-engine';

type inputs = {
	/**
	 * The audio buffer
	 */
	buffer: AudioBuffer;
	loop?: boolean;
};

export class AudioSourceNode extends AudioBaseNode {
	static title = 'Audio Source node';
	static type = 'studio.tokens.audio.source';

	audioNode: GainNode | undefined;
	bufferNode: AudioBufferSourceNode | undefined;

	declare inputs: ToInput<inputs>;

	_values: { buffer?: AudioBuffer; loop?: boolean } = {};

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('buffer', {
			type: AudioBufferSchema,
			visible: true
		});
		this.addInput('loop', {
			type: BooleanSchema
		});
		this.addOutput('node', {
			type: {
				...NodeSchema,
				description: 'The generated oscillator node'
			},
			visible: true
		});
	}

	async execute(): Promise<void> {
		const context = this.getAudioCtx();
		const { buffer, loop } = this.getAllInputs<inputs>();

		this._values = { buffer, loop };

		if (!this.audioNode) {
			this.audioNode = context.createGain();
		}

		this.setOutput('node', this.audioNode);
	}

	onStart = () => {
		//Buffer nodes cannot be reused, so we need to create a new one each time
		try {
			const context = this.getAudioCtx();
			const { buffer, loop } = this._values;
			const newBufferSource = context.createBufferSource();
			newBufferSource.buffer = buffer!;
			newBufferSource.loop = loop!;

			if (this.bufferNode) {
				//Cleanup old buffer
				this.bufferNode.disconnect(this.audioNode!);
			}

			newBufferSource.connect(this.audioNode!);
			newBufferSource.start();
			this.bufferNode = newBufferSource;
		} catch (e) {
			console.log(e);
		}
	};
	onStop = () => {
		try {
			this.bufferNode?.stop();
		} catch (e) {
			//
		}
	};
}
