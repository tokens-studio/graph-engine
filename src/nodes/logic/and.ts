import { MappedInput, mapInput } from "./common.js";
import { NodeDefinition, NodeTypes } from '../../types.js';

export const type = NodeTypes.AND;



/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input 
 * @param state 
 * @returns 
 */
export const process = (input: MappedInput) => {

    return input.inputs.reduce((acc, x) => {
        //coerce to bool
        return acc && !!x.value;
    }, true)
}


export const node: NodeDefinition<MappedInput> = {
    type,
    mapInput,
    process,
}