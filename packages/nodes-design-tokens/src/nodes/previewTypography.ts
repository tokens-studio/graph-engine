
import {  Node,  StringSchema } from "@tokens-studio/graph-engine";
import { TokenArraySchema } from "../schemas/index.js";

export default class NearestColorNode extends Node {
    static title = "Preview Typography";
    static type = 'studio.tokens.preview.typography';
    static description = "Previews typographic tokens";

    constructor(props) {
        super(props);

        this.addInput("value", {
            type: TokenArraySchema,
            visible: true
        });
        this.addInput('text', {
            type: { ...StringSchema, default: 'The quick brown fox jumps over the lazy dog' },
            visible: false
        });
    }
}
