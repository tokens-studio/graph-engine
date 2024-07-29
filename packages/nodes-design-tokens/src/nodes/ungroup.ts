import {
	INodeDefinition,
	Node,
	StringSchema
} from '@tokens-studio/graph-engine';
import { TokenSetSchema } from '../schemas/index.js';

export default class UngroupNode extends Node {
	static title = 'Ungroup tokens';
	static type = 'studio.tokens.design.ungroup';
	static description = 'Ungroups tokens by removing their namespace';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('accessor', {
			type: StringSchema
		});
		this.addInput('tokens', {
			type: TokenSetSchema
		});
		this.addOutput('value', {
			type: TokenSetSchema
		});
	}

	execute(): void | Promise<void> {
		const { accessor, tokens } = this.getAllInputs();

		const accessorParts = accessor.split('.');

		//We assume that we will throw an error if we cannot find the values
		let output = tokens;
		for (const accessor of accessorParts) {
			output = output[accessor];
		}

		this.setOutput('value', output);
	}
}
