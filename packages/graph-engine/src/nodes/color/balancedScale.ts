import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";

export const type = NodeTypes.BALANCED_SCALE;

export type State = {
    steps: number;
};

export const defaults: State = {
    steps: 25,
};

export type Input = {
    startingColor: string;
} & State;

export const process = (input: Input, state: State) => {
    const final = {
        ...state,
        ...input,
    };

    const startColor = chroma(final.startingColor).oklch();

    const startL = startColor[0];
    const startC = startColor[1];
    const startH = startColor[2];

    let generatedColors: string[] = [];

    const fixedLightnessValues = [98, 96, 92, 88, 82, 78, 74, 70, 66, 62, 56, 52, 48, 43, 39, 34, 31, 26, 23, 20, 16, 12, 9, 5];

    for (let i = 0; i < final.steps; i++) {
        const t = i / (final.steps - 1);

        const c = startC; // Keep the chroma constant
        const l = bezierInterpolate(t, 0.998, 0.42, 0.58, 0.05);
        const h = startH;

        const color = chroma.oklch(l, c, h);
        generatedColors.push(color.hex());
    }

    return generatedColors;
};

export const mapOutput = (input, state, processed) => {
    const array = processed.map((x, i) => {
        return {
            name: "" + i,
            value: x,
            type: "color",
        };
    });

    return processed.reduce(
        (acc, color, i) => {
            acc[i] = color;
            return acc;
        },
        {
            array,
        }
    );
};

export const node: NodeDefinition<Input, State> = {
    type,
    defaults,
    process,
    mapOutput,
};

function bezierInterpolate(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p0 + 3 * u * t * t * p3 + t * t * t * p3;
}


