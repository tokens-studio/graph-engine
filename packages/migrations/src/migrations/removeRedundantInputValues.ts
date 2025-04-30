import type {
	SerializedGraph,
	SerializedNode
} from '@tokens-studio/graph-engine';

export const removeRedundantInputValues = async (
	graph: SerializedGraph
): Promise<SerializedGraph> => {
	if (graph.nodes) {
		graph.nodes.forEach((node: SerializedNode | null | undefined) => {
			if (!node || !node.inputs) {
				return;
			}

			node.inputs.forEach(serializedInput => {
				const isVariadic = serializedInput.variadic === true;

				const isConnected = graph.edges?.some(
					edge =>
						edge.target === node.id &&
						edge.targetHandle === serializedInput.name
				);

				if (isConnected && !isVariadic) {
					delete serializedInput.value;
				}
			});
		});
	}

	return graph;
};
