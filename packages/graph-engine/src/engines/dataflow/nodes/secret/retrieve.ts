import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { SecretCapability } from '../../capabilities/secret.js';
import { StringSchema } from '../../schemas/index.js';

export default class NodeDefinition extends DataflowNode {
	static title = 'Retrieve Secret';
	static type = 'studio.tokens.secret.retrieve';

	static description = 'Retrieves a secret';

	//Requires the secret capability
	static annotations = {
		'engine.capability.secret': true
	};

	constructor(props) {
		super(props);

		this.addInput('secret', {
			type: StringSchema
		});
		this.addInput('key', {
			type: StringSchema
		});
		this.addOutput('value', {
			type: StringSchema
		});
	}
	async execute() {
		const { secret, key } = this.getAllInputs();

		const secretCapability = this.getGraph().capabilities[
			'secret'
		] as SecretCapability;

		const value = await secretCapability.getSecret({ secret, key });

		this.outputs.value.set(value);
	}
}
