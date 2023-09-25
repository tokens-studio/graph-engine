// node
/**
 * Performs a distance calculation between two colors using chroma.js library
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from 'chroma-js';

export const type = NodeTypes.COLOR_DISTANCE;

type Inputs = {
    /**
     * Color
     */
    color1: string;
    /**
     * Color
     */
    color2: string;
};

const process = (input: Inputs, state) => {
    const { color1, color2 } = input;

    if (!chroma.valid(color1) || !chroma.valid(color2)) {
        throw new Error('Invalid color inputs');
    }

    const distance = chroma.deltaE(color1, color2);

    return { distance };
};

const mapOutput = (input, state, output) => {
    return output;
};

export const node: NodeDefinition<Inputs> = {
    type,
    mapOutput,
    process
};
