import { NodeDefinition, NodeTypes } from '../../types.js';


export const  type = NodeTypes.CONSTANT;


/**
 * Defines the starting state of the node
 */
export const defaults = {
    input: undefined
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
    return state.input;
}

export const node: NodeDefinition = {
    type,
    defaults,
    process,
}