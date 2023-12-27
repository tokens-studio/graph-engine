import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { CurveSchema, NumberSchema } from "@/schemas/index.js";
import { vec } from "mafs"

const sampleBezier = (bezier, sample) => {

    const { a, b, c, d } = bezier

    return [
        vec.scale(a, -(sample ** 3) + 3 * sample ** 2 - 3 * sample + 1),
        vec.scale(b, 3 * sample ** 3 - 6 * sample ** 2 + 3 * sample),
        vec.scale(c, -3 * sample ** 3 + 3 * sample ** 2),
        vec.scale(d, sample ** 3),
    ].reduce(vec.add, [0, 0])

}


export default class NodeDefinition extends Node {
    static title = "Sample Curve";
    static type = NodeTypes.SAMPLE_CURVE;
    static description = "Samples a curve at a specified point";
    constructor(props?: INodeDefinition) {
        super(props);
        this.addInput("curve", {
            type: CurveSchema,
            visible: true,
        });
        this.addInput("sample", {
            type: NumberSchema,
            visible: true,
        });
        this.addOutput("value", {
            type: NumberSchema,
            visible: true,
        });
    }

    execute(): void | Promise<void> {
        const { curve, sample } = this.getAllInputs();

        //TODO this currently assumes that the curve is purely just beziers
        const foundCurve = curve.find(piece => piece.a <= sample && piece.d >= sample);

        const output = sampleBezier(foundCurve, sample);


        this.setOutput("value", output);
    }
}
