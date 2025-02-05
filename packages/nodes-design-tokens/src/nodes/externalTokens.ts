import { EditorExternalSet } from '@tokens-studio/graph-editor/index.js';
import { Graph, INodeDefinition, Node } from '@tokens-studio/graph-engine';
import { TokenSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class ExternalTokensNode extends Node {
	static title = 'External Token Set';
	static type = 'studio.tokens.design.externalSet';
	static description =
		'Retrieves an external set of tokens and then exposes them';

	constructor(props: INodeDefinition) {
		super(props);
		this.addOutput('tokenSet', {
			type: arrayOf(TokenSchema)
		});
	}

	async execute() {
		const { uri } = this.getAllInputs();
		const graph = this.getGraph();
		const graphGeneratorId = (graph as Graph).annotations[
			'graphGeneratorId'
		] as string;

		if (!uri) {
			throw new Error('No uri specified');
		}

		const sets = await this.load('', { listSets: true });
		const selectedSet = sets.find(set => set.name === uri);
		const selectedSetData = this.annotations[
			'selectedSetData'
		] as EditorExternalSet;

		if (selectedSet?.containsThemeContextNode) {
			this.annotations['themeContextWarningSet'] = selectedSet.name;
		}

		if (selectedSetData) {
			this.annotations['referencedDynamicSets'] = selectedSetData.generatorId;
		}

		if (graphGeneratorId) {
			this.annotations['graphGeneratorId'] = graphGeneratorId;
		}

		const tokens = await this.load(uri);
		this.outputs.tokenSet.set(tokens);
	}
}
