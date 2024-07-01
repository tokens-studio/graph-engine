import { AudioBaseNode } from './base.js';
import { AudioBufferSchema } from '../schemas/index.js';
import {
	INodeDefinition,
	NumberSchema,
	ToInput
} from '@tokens-studio/graph-engine';

type inputs = {
	/**
	 * The length of the sample
	 */
	length: number;
	/**
	 * The number of channels
	 */
	channels: number;
};

export class AudioWhiteNoiseNode extends AudioBaseNode {
	static title = 'Audio whitenoise';
	static type = 'studio.tokens.audio.whiteNoise';

	declare inputs: ToInput<inputs>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('channels', {
			type: {
				...NumberSchema,
				default: 1
			},
			visible: true
		});
		this.addInput('length', {
			type: {
				...NumberSchema,
				default: 3
			},
			visible: true
		});
		this.addOutput('buffer', {
			type: AudioBufferSchema,
			visible: true
		});
	}

	async execute(): Promise<void> {
		const context = this.getAudioCtx();
		const { channels, length } = this.getAllInputs<inputs>();

		const buffer = context.createBuffer(
			channels,
			length * context.sampleRate,
			context.sampleRate
		);

		for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
			// This gives us the actual array that contains the data
			const nowBuffering = buffer.getChannelData(channel);
			for (let i = 0; i < buffer.length; i++) {
				// Math.random() is in [0; 1.0]
				// audio needs to be in [-1.0; 1.0]
				nowBuffering[i] = Math.random() * 2 - 1;
			}
		}

		this.setOutput('buffer', buffer);
	}
}
