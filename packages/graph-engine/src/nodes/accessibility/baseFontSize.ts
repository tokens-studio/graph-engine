// node
/**
 * Calculates the base font size
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.BASE_FONT_SIZE;

type Inputs = {
    visualAcuity: number;
    lightingCondition: number;
    distance: number;
    xHeightRatio: number;
    ppi: number;
    pixelDensity: number;
};

const process = (input: Inputs, state) => {
    const correctionFactor = 13; // Please define the correct value for the correction factor
    const {
        visualAcuity,
        lightingCondition,
        distance,
        xHeightRatio,
        ppi,
        pixelDensity,
    } = input;

    const visualCorrection = correctionFactor * (lightingCondition / visualAcuity);
    const xHeightMM = Math.tan(visualCorrection * Math.PI / 21600) * (distance * 10) * 2;
    const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
    const fontSizePT = 2.83465 * xHeightMM * 1 / xHeightRatio;
    const fontSizePX = 1 * xHeightPX / xHeightRatio;

    return { fontSizePX };
};

export const mapOutput = (input, state, processed) => {
    return processed;
};

export const node: NodeDefinition<Inputs> = {
    type,
    process,
    mapOutput
};
