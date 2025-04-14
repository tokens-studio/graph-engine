import {
	INodeDefinition,
	Node,
	StringSchema,
	annotatedInputError
} from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ExternalTokensNode extends Node {
	static title = 'External Token Set';
	static type = 'studio.tokens.design.externalSet';
	static description =
		'Retrieves an external set of tokens and then exposes them';

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('uri', {
			type: StringSchema
		});
		this.addOutput('tokenSet', {
			type: arrayOf(TokenSchema)
		});
	}

	override async execute() {
		const { uri } = this.getAllInputs();

		if (!uri) {
			throw new Error('No uri specified');
		}

		const tokens = await this.load(uri);

		if (!tokens) {
			// set this so we can show a red border around the node to indicate an error
			this.error = new Error('Failed to load tokens');
			if (this.inputs['uri']) {
				// set this so we can show an error in the graph editor input sheet
				this.inputs['uri'].annotations[annotatedInputError] = {
					message:
						'Failed to load tokens. Check if the uri is valid and the set was not deleted or renamed.'
				};
			}
		} else {
			if (this.outputs && this.outputs.tokenSet) {
				this.outputs.tokenSet.set(tokens);
			}

			// clear the error if there is one
			if (this.error) {
				this.error = null;
				if (this.inputs['uri']) {
					delete this.inputs['uri'].annotations[annotatedInputError];
				}
			}
		}
	}
}
