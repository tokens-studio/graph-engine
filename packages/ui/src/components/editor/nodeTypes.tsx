import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { nodes as figmaNodes } from '@tokens-studio/graph-engine-nodes-figma';
import { nodeLookup } from '@tokens-studio/graph-engine';
import { nodes as previewNodes } from '@tokens-studio/graph-engine-nodes-preview';

const flatten = nodes =>
	nodes.reduce((acc, node) => {
		acc[node.type] = node;
		return acc;
	}, {});

const defaultNodes = {
	//Default
	...nodeLookup,
	//Audio
	...audioLookup,
	...flatten(designNodes),
	...flatten(figmaNodes),
	...flatten(previewNodes)
};

//These are all the nodes that are available in the editor
export const nodeTypes = defaultNodes;
