
import { NodeDefinition, NodeTypes } from '../../types.js';


export const type = NodeTypes.RANDOM;

//We assume that the value is generated once on creation
export const process = (input,state) => state.value

export const node: NodeDefinition = {
    type,
    process
}