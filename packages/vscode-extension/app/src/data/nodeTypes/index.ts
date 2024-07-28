import { nodes as fsNodes } from '@tokens-studio/graph-engine-nodes-fs';
import { nodeLookup } from '@tokens-studio/graph-engine';

//These are all the nodes that are available in the editor
export const nodeTypes = {
  //Default
  ...nodeLookup,
  ...fsNodes.reduce((acc, node) => {
    acc[node.type] = node;
    return acc;
  }, {}),
};
