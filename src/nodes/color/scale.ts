import { NodeDefinition, NodeTypes } from '../../types.js';
import chroma from 'chroma-js'

export const type = NodeTypes.SCALE;


export const defaults = {
    stepsUp: 4,
    stepsDown: 4,
}

export const process = (input, state) => {

    const final = {
        ...state,
        ...input,
    }


    const stepsUp = Math.max(0, parseInt('' + final.stepsUp)) + 2;
    const stepsDown = Math.max(0, parseInt('' + final.stepsDown)) + 2;

    const lighter = chroma.scale(['white', final.color]).mode('hsl').colors(stepsUp).slice(1, -1);
    const darker = chroma.scale([final.color, 'black']).mode('hsl').colors(stepsDown).slice(1, -1);
    return [].concat(lighter, final.color, darker);

}

export const mapOutput = (input, state, processed) => {
    return processed.reduce((acc, color, i) => {
        acc[i] = color;
        return acc;
    }, {});
};


export const node: NodeDefinition = {
    type,
    defaults,
    process,
    mapOutput
}