import {
    INodeDefinition,
    Node,
    StringSchema,
    ToOutput,
} from "@tokens-studio/graph-engine";
import { TokenTypographySchema } from "../schemas/index.js";
import type { TokenBorderValue } from "@tokens-studio/types";


export default class CreateBorderNode extends Node {
    static title = "Create a Border token";
    static type = "studio.tokens.design.createBorder";
    static description = "Creates a composite Border value from inputs";


    declare outputs: ToOutput<{
        token: TokenBorderValue
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("color", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("width", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("style", {
            type: StringSchema,
            visible: true,
        });


        this.addOutput("value", {
            type: TokenTypographySchema,
            visible: true,
        });
    }

    execute(): void | Promise<void> {
        const props = this.getAllInputs();
        this.setOutput("value", props);
    }
}
