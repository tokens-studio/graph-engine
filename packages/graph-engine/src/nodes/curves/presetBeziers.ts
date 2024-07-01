import { Curve } from "../../types.js";
import { CurveSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";


export const presetBeziers = {
    'easeInOutSine': [0.445, 0.05, 0.55, 0.95],
    'easeInOutQuad': [0.455, 0.03, 0.515, 0.955],
    'easeInOutCubic': [0.645, 0.045, 0.355, 1],
    'easeInOutQuart': [0.77, 0, 0.175, 1],
    'easeInOutQuint': [0.86, 0, 0.07, 1],
    'easeInOutExpo': [1, 0, 0, 1],
    'easeInOutCirc': [0.785, 0.135, 0.15, 0.86],
    'easeInOutBack': [0.68, -0.55, 0.265, 1.55],
    'easeInOutElastic': [0.5, -0.5, 1, 1.5],
    'linear': [0, 0, 1, 1],
    'easeInSine': [0.47, 0, 0.75, 0.72],
    'easeInQuad': [0.55, 0.085, 0.68, 0.53],
    'easeInCubic': [0.55, 0.055, 0.675, 0.19],
    'easeInQuart': [0.895, 0.03, 0.685, 0.22],
    'easeInQuint': [0.755, 0.05, 0.855, 0.06],
    'easeInExpo': [0.95, 0.05, 0.795, 0.035],
    'easeInCirc': [0.6, 0.04, 0.98, 0.335],
    'easeInBack': [0.6, -0.28, 0.735, 0.045],
    'easOutSine': [0.39, 0.575, 0.565, 1],
    'easeOutQuad': [0.25, 0.46, 0.45, 0.94],
    'easeOutCubic': [0.215, 0.61, 0.355, 1],
    'easeOutQuart': [0.165, 0.84, 0.44, 1],
    'easeOutQuint': [0.23, 1, 0.32, 1],
    'easeOutExpo': [0.19, 1, 0.22, 1],
    'easeOutCirc': [0.075, 0.82, 0.165, 1],
    'easeOutBack': [0.175, 0.885, 0.32, 1.275]
};
    
export default class BezierCurveNode extends Node {
    static title = "Preset Bezier Curves";
    static type = "studio.tokens.curve.presetBeziers";
    static description = "Allows you to choose from preset bezier curves";

    declare inputs: ToInput<{
        name: string;
    }>;

    declare outputs: ToOutput<{
        curve: Curve;
    }>;

    constructor(props: INodeDefinition) {
        super(props);

        this.addInput("name", {
            type: {
                ...StringSchema,
               enum : Object.keys(presetBeziers),
               default:'linear'
            },
        });

        this.addOutput("curve", {
            type: CurveSchema,
        });
    }

    execute(): void | Promise<void> {
        const { name} = this.getAllInputs();

        if (!presetBeziers[name]) {
            throw new Error(`Invalid preset bezier curve: ${name}`);
        }

        const [x1, y1, x2, y2] = presetBeziers[name];

        const curve: Curve = {
            curves: [
                {
                    type: "bezier",
                    points: [
                        [0, 0],    // Start point
                        [x1, y1],  // First control point
                        [x2, y2],  // Second control point
                        [1, 1],    // End point
                    ],
                },
            ],
        };

        this.setOutput("curve", curve);
    }

}