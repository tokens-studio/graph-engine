import type {
	SerializedGraph,
	SerializedNode
} from '@tokens-studio/graph-engine';

export const removePositionAnnotations = async (
	graph: SerializedGraph
): Promise<SerializedGraph> => {
	if (graph.nodes) {
		graph.nodes.forEach((node: SerializedNode | null | undefined) => {
			if (node?.annotations) {
				delete node.annotations.xpos;
				delete node.annotations.ypos;
			}
		});
	}
	return graph;
};
