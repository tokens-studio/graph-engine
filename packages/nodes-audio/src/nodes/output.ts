import { AudioBaseNode } from './base.js';
import { INodeDefinition, ToInput } from '@tokens-studio/graph-engine';
import { NodeSchema } from '../schemas/index.js';

export class AudioOutputNode extends AudioBaseNode {
	static title = 'Audio Output node';
	static type = 'studio.tokens.audio.output';

	_last: AudioNode | undefined;

	declare inputs: ToInput<{
		input: AudioNode;
	}>;

	static description =
		'Provides access to the output of a the audio context. This is the final node in the audio graph.';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('input', {
			visible: true,
			type: NodeSchema
		});
		this.annotations['engine.singleton'] = true;
	}

	execute(): void | Promise<void> {
		const { input } = this.getAllInputs();

		if (this._last) {
			this._last.disconnect(this.getAudioCtx().destination);
			this._last = undefined;
		}

		input.connect(this.getAudioCtx().destination);
		this._last = input;
	}
}
