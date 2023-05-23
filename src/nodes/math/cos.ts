import { NodeDefinition, NodeTypes } from '../../types.js';


export const type = NodeTypes.COS;
/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input 
 * @param state 
 * @returns 
 */
export const process = (input) => Math.cos(input.value)

export const node: NodeDefinition = {
    type,
    process
}