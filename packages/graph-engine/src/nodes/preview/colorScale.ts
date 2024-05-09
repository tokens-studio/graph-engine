import { Node } from "../../programmatic/node.js";
import { ColorArraySchema } from "../../schemas";

export default class NodeDefinition extends Node {
    static title = "Color Scale";
    static type = 'studio.tokens.preview.colorScale';

    static description = "Previews a color scale";

    constructor(props) {
        super(props);

        this.addInput("value", {
            type: ColorArraySchema,
            visible: true
        });
    }
}