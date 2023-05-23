import { NodeDefinition, NodeTypes } from '../../types.js';

export const type = NodeTypes.SWITCH;

export const defaults = {
    //Orders the cases in the UI as the input is an object
    order: [] as string[]
}

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input 
 * @param state 
 * @returns 
 */
export const process = (input, state) => {
    const candidate = input[input.condition];
    return candidate;
}


export const node: NodeDefinition = {
    defaults,
    type,
    process,
}