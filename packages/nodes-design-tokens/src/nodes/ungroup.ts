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
		this.addInput('name', {
			type: StringSchema
		});
		this.addInput('tokenSet', {
			type: TokenSetSchema
		});
		this.addOutput('tokenSet', {
			type: TokenSetSchema
		});
	}

	execute(): void | Promise<void> {
		const { name, tokenSet } = this.getAllInputs();

		const accessorParts = name.split('.');

		//We assume that we will throw an error if we cannot find the values
		let output = tokenSet;
		for (const accessor of accessorParts) {
			output = output[accessor];
		}

		this.setOutput('tokenSet', output);
	}
}
