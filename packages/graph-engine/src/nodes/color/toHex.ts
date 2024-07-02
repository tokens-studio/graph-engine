import { Black, toColor, toHex } from "./lib/utils.js";
import { Color } from "../../types.js";
import {
    ColorSchema,
    StringSchema,
} from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition extends Node {
    static title = "Color to hex";
    static type = "studio.tokens.color.toHex";
    static description = "Converts a color to a hex string";

    declare inputs: ToInput<{
        color: Color;
    }>;
    declare outputs: ToOutput<{
        value: string
    }>;


    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("color", {
            type: {
                ...ColorSchema,
                default: Black,
            },
        });
        this.addOutput("value", {
            type: StringSchema,
        });
    }

    execute(): void | Promise<void> {
        const { color } = this.getAllInputs();
        const col = toHex(toColor(color));
        this.setOutput('value', col);
    }
}
