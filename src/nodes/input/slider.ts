import { NodeDefinition, NodeTypes } from '../../types.js';


export const type = NodeTypes.SLIDER;

/**
 * The other values are used for the UI control 
 */
export const defaults = {
    value: 0.5,
    max: 1,
    step: 0.01
}

export const process = (input, state) => {
    return state.value;
}

export const mapOutput = (input, state, processed) => {
    return { output: processed };
}

export const node: NodeDefinition = {
    type,
    defaults,
    process,
    mapOutput
}