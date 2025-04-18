import { annotatedVersion } from '@tokens-studio/graph-engine';

export const removeRedundantInputValues = async graph => {
	graph.annotations[annotatedVersion] = '0.9.11';

	if (graph.nodes) {
		Object.values(graph.nodes).forEach(node => {
			if (node.serialized?.inputs) {
				node.serialized.inputs.forEach(serializedInput => {
					const input = node.inputs?.[serializedInput.name];

					if (input && !input.variadic && input._edges?.length > 0) {
						delete serializedInput.value;
					}
				});
			}
		});
	}

	return graph;
};
