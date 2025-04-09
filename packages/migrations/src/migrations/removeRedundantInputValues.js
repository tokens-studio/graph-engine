import { annotatedVersion } from '@tokens-studio/graph-engine';

export const removeRedundantInputValues = async graph => {
	graph.annotations[annotatedVersion] = '0.9.11';

	Object.values(graph.nodes || {}).forEach(node => {
		Object.values(node.inputs || {}).forEach(input => {
			if (input.variadic) return;

			const hasConnections = (input._edges || []).length > 0;

			if (hasConnections) {
				input._value = undefined;
			}
		});
	});

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
