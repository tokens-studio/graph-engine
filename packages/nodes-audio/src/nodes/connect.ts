import { AudioBaseNode } from './base.js';
import {
	INodeDefinition,
	ToInput,
	ToOutput,
	createVariadicSchema
} from '@tokens-studio/graph-engine';
import { NodeSchema } from '../schemas/index.js';

export class AudioConnectNode extends AudioBaseNode {
	static title = 'Audio Connect node';
	static type = 'studio.tokens.audio.connect';

	declare inputs: ToInput<{
		source: AudioNode[];
		destination: AudioNode;
	}>;
	declare outputs: ToOutput<{
		destination: AudioNode;
	}>;

	static description = 'An explicit connection between audio nodes';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('source', {
			type: {
				...createVariadicSchema(NodeSchema),
				default: []
			},
			variadic: true
		});
		this.addInput('destination', {
			type: NodeSchema
		});
		this.addOutput('destination', {
			type: NodeSchema
		});
	}

	execute(): void | Promise<void> {
		const { destination, source } = this.getAllInputs();

		source.map(sourceNode => {
			sourceNode.disconnect();
			sourceNode.connect(destination);
		});

		this.outputs.destination.set(destination);
	}
}
