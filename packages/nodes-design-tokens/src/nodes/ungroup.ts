import {
	DataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	ToOutput
} from '@tokens-studio/graph-engine';
import { DeepKeyTokenMap } from '@tokens-studio/types';
import { TokenSetSchema } from '../schemas/index.js';

export default class UngroupNode extends DataflowNode {
	static title = 'Ungroup tokens';
	static type = 'studio.tokens.design.ungroup';
	static description = 'Ungroups tokens by removing their namespace';

	declare inputs: ToInput<{
		name: string;
		tokenSet: DeepKeyTokenMap;
	}>;

	declare outputs: ToOutput<{
		tokenSet: DeepKeyTokenMap;
	}>;

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
		let output: DeepKeyTokenMap = tokenSet;
		for (const accessor of accessorParts) {
			output = output[accessor] as DeepKeyTokenMap;
		}

		this.outputs.tokenSet.set(output);
	}
}
