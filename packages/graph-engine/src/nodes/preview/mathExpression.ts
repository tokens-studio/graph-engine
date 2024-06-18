import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas";

export default class NodeDefinition extends Node {
    static title = "Math Expression";
    static type = 'studio.tokens.preview.mathExpression';

    static description = "Visuaize a math expression";

    constructor(props) {
        super(props);

        this.addInput("value", {
            type: StringSchema,
            visible: true
        });
    }
}