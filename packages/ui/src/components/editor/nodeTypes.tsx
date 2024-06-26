import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { nodes as imageNodes } from '@tokens-studio/graph-engine-nodes-image';
import { nodeLookup } from '@tokens-studio/graph-engine';

//These are all the nodes that are available in the editor
export const nodeTypes = {
    //Default
    ...nodeLookup,
    //Audio
    ...audioLookup,
    ...imageNodes.reduce((acc, node) => {
        acc[node.type] = node;
        return acc;
    }, {}),
    //Design tokens
    ...designNodes.reduce((acc, node) => {
        acc[node.type] = node;
        return acc;
    }, {})
}