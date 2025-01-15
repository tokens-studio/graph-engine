import { Graph } from '@tokens-studio/graph-engine';
import { client } from '@/api/sdk/index.ts';
import { nodeTypes } from '@/components/editor/nodeTypes.tsx';
import Subgraph from '@tokens-studio/graph-engine/nodes/generic/subgraph.js';

export const loadCompounds = async (type: string) => {
	if (type.startsWith('graph.')) {
		const raw = await client.marketplace.retrieveGraph.query({
			params: {
				id: type.split('.')[1]
			}
		});

		const innergraph = await new Graph().deserialize(
			raw.body.graph,
			loadCompounds
		);

		return class CustomNode extends Subgraph {
			static type = type;
			constructor(data) {
				super({
					...data,
					innergraph
				});
			}

			override serialize() {
				const serialized = super.serialize();
				// Don't store the innergraph
				serialized.innergraph = undefined;
				return serialized;
			}
			static override async deserialize(opts) {
				return await super.deserialize({ ...opts, innergraph: raw.body.graph });
			}
		};
	} else {
		return nodeTypes[type];
	}
};
