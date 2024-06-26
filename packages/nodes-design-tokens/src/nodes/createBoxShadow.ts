import {
    INodeDefinition,
    Node,
    StringSchema,
    ToOutput,
} from "@tokens-studio/graph-engine";
import { TokenBoxShadowSchema } from "../schemas/index.js";
import type { TokenBoxshadowValue } from "@tokens-studio/types";


export default class CreateBoxShadowNode extends Node {
    static title = "Create a Box Shadow token";
    static type = "studio.tokens.design.createBoxShadow";
    static description = "Creates a composite box shadow value from inputs";


    declare outputs: ToOutput<{
        token: TokenBoxshadowValue
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("x", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("y", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("blur", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("spread", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("color", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("type", {
            type: StringSchema,
            visible: true,
        });


        this.addOutput("value", {
            type: TokenBoxShadowSchema,
            visible: true,
        });
    }

    execute(): void | Promise<void> {
        const props = this.getAllInputs();
        this.setOutput("value", props);
    }
}
