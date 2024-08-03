import { CurveSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

type Vec2 = [number, number];

function cubicBezier(t: number, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): Vec2 {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const p = [
        uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
        uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
    ];

    return p as Vec2;
}

function evaluateCurve(x: number, points: Vec2[]): number {
    if (points.length !== 4) {
        throw new Error("Cubic Bezier curve requires exactly 4 control points.");
    }

    // Binary search to find the parameter t for given x
    let t = 0.5;
    let step = 0.25;
    let [px, py] = cubicBezier(t, points[0], points[1], points[2], points[3]);

    for (let i = 0; i < 10; i++) { // Adjust iteration count for desired precision
        if (Math.abs(px - x) < 0.0001) break; // Adjust epsilon for desired accuracy
        if (px < x) t += step;
        else t -= step;
        step *= 0.5;
        [px, py] = cubicBezier(t, points[0], points[1], points[2], points[3]);
    }

    return py;
}

export default class NodeDefinition extends Node {
    static title = 'Float Curve';
    static type = 'studio.tokens.curve.floatCurve';
    static description = 'Evaluates a float curve at a given x value';

    declare inputs: ToInput<{
        curve: { curves: { points: Vec2[] }[] };
        x: number;
    }>;
    declare outputs: ToOutput<{
        y: number;
    }>;

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput('curve', {
            type: CurveSchema
        });
        this.addInput('x', {
            type: NumberSchema
        });
        this.addOutput('y', {
            type: NumberSchema
        });
    }

    execute(): void | Promise<void> {
        const { curve, x } = this.getAllInputs();
        const points = curve.curves[0].points;
        const y = evaluateCurve(x, points);
        this.setOutput('y', y);
    }
}