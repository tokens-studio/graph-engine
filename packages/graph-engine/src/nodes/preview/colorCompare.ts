import { Node } from "@/programmatic/node.js";
import { ColorSchema } from "@/schemas";

export default class NodeDefinition extends Node {
    static title = "Color Compare";
    static type = 'studio.tokens.preview.colorCompare';

    static description = "Compares colors";

    constructor(props) {
        super(props);

        this.addInput("colorA", {
            type: ColorSchema,
            visible: true
        });

        this.addInput("colorB", {
            type: ColorSchema,
            visible: true
        });
    }
}