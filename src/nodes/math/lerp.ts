import { NodeDefinition, NodeTypes } from '../../types.js';


export const type = NodeTypes.LERP;

export const defaults = {
    a: 0,
    b: 0,
    t: 0
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

    const a = parseFloat(final.a);
    const b = parseFloat(final.b);
    const t = parseFloat(final.t);

    return a + t * (b - a);
}

export const node: NodeDefinition = {
    type,
    defaults,
    process
}