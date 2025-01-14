import { AudioBaseNode } from './base.js';
import {
	INodeDefinition,
	NumberSchema,
	StringSchema,
	ToInput
} from '@tokens-studio/graph-engine';
import { NodeSchema } from '../schemas/index.js';

export class AudioOscillatorNode extends AudioBaseNode {
	static title = 'Audio Oscillator node';
	static type = 'studio.tokens.audio.oscillator';

	audioNode: GainNode | undefined;
	oscillatorNode: OscillatorNode | undefined;

	declare inputs: ToInput<{
		type: string;
		frequency: number;
	}>;

	_values: { type?: string; frequency?: number } = {};

	static description =
		'Creates an oscillator node, a source representing a periodic waveform. It basically generates a constant tone.';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('type', {
			type: {
				...StringSchema,
				enum: ['sawtooth', 'sine', 'square', 'triangle'],
				default: 'sine'
			}
		});
		this.addInput('frequency', {
			type: {
				...NumberSchema,
				default: 3000
			}
		});
		this.addOutput('node', {
			type: {
				...NodeSchema,
				description: 'The generated oscillator node'
			},
			visible: true
		});
	}

	execute(): void | Promise<void> {
		const context = this.getAudioCtx();
		const { type, frequency } = this.getAllInputs();

		// Store the values
		this._values = { type, frequency };

		if (!this.audioNode) {
			this.audioNode = context.createGain();
		}

		if (this.oscillatorNode) {
			this.oscillatorNode.type = type as OscillatorType;
			this.oscillatorNode.frequency.setValueAtTime(
				frequency,
				context.currentTime
			);
		}

		this.outputs.node.set(this.audioNode);
	}

	onStart = () => {
		//Buffer nodes cannot be reused, so we need to create a new one each time
		try {
			const context = this.getAudioCtx();
			const { type, frequency } = this._values;
			const newBufferSource = context.createOscillator();
			newBufferSource.type = type as OscillatorType;
			newBufferSource.frequency.setValueAtTime(frequency!, context.currentTime);

			if (this.oscillatorNode) {
				//Cleanup old node
				this.oscillatorNode.disconnect(this.audioNode!);
			}

			newBufferSource.connect(this.audioNode!);
			newBufferSource.start();
			this.oscillatorNode = newBufferSource;
		} catch (e) {
			console.log(e);
		}
	};
	onStop = () => {
		try {
			this.oscillatorNode?.stop();
		} catch (e) {
			//
		}
	};
}
