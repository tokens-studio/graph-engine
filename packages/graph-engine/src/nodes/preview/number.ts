import { Node } from "@/programmatic/node.js";
import { NumberSchema } from "@/schemas";

export default class NodeDefinition extends Node {
    static title = "Number";
    static type = 'studio.tokens.preview.number';

    static description = "Previews a number";

    constructor(props) {
        super(props);

        this.addInput("value", {
            type: {...NumberSchema, default: 0},
            visible: true
        });

        this.addInput("precision", {
            type: {...NumberSchema, default: 2}
        });
    }
}