import { NodeDefinition, NodeTypes } from '../../types.js';


export const type = NodeTypes.CLAMP;

export const defaults = {
    value: 0,
    min: 0,
    max: 0
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

    //Override with state if defined
    const final = {
        ...state,
        ...input
    };

    const value = parseFloat(final.value);
    const min = parseFloat(final.min);
    const max = parseFloat(final.max);

    return value > max ? max : value < min ? min : value;
}


export const node: NodeDefinition = {
    type,
    defaults,
    process
}