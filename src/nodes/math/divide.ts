import { MappedInput } from "./common.js";
import { NodeDefinition, NodeTypes } from '../../types.js';
import { mapInput } from './common.js'

export const type = NodeTypes.DIV;


/**
 * Optional validation function. 
 * @param inputs 
 */
export const validateInputs = (inputs) => {

    if (inputs.inputs.length < 2) {
        throw new Error('Not enough inputs ')
    }
    inputs.inputs.forEach(x => {
        if (isNaN(x.value)) {
            throw new Error('Invalid input, expected a number');
        }
    });
}

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input 
 * @returns 
 */
export const process = (input: MappedInput) => {
    const vals = input.inputs.slice(1);
    return vals.reduce((acc, x) => acc / x.value, input.inputs[0].value)
}
export const node: NodeDefinition<MappedInput> = {
    type,
    mapInput,
    validateInputs,
    process
}