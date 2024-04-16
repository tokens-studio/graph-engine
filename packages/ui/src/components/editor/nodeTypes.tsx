import { nodeLookup } from '@tokens-studio/graph-engine';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';

//These are all the nodes that are available in the editor
export const nodeTypes = {
    //Default
    ...nodeLookup,
    //Audio
    ...audioLookup,
    //Design tokens
    ...designNodes.reduce((acc, node) => {
        acc[node.type] = node;
        return acc;
    },{})
}