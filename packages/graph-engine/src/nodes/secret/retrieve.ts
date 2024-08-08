import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
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

		this.dataflow.addInput('secret', {
			type: StringSchema
		});
		this.dataflow.addInput('key', {
			type: StringSchema
		});
		this.dataflow.addOutput('value', {
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
