import {
	AnySchema,
	INodeDefinition,
	ToInput
} from '@tokens-studio/graph-engine';
import { AudioBaseNode } from './base.js';
import { AudioBufferSchema } from '../schemas/index.js';

export type inputs = {
	resource: Buffer;
};

export class AudioLoadBufferNode extends AudioBaseNode {
	static title = 'Audio Load Buffer node';
	static type = 'studio.tokens.audio.loadBuffer';

	declare inputs: ToInput<inputs>;
	static description = 'Converts a buffer to an audio buffer';

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('resource', {
			type: AnySchema,
			visible: true
		});
		this.addOutput('buffer', {
			visible: true,
			type: AudioBufferSchema
		});
	}

	execute(): void | Promise<void> {
		const { resource } = this.getAllInputs<inputs>();

		const context = this.getAudioCtx();

		return new Promise((resolve, reject) => {
			context.decodeAudioData(resource.buffer, res => {
				try {
					this.setOutput('buffer', res);
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		});
	}
}
