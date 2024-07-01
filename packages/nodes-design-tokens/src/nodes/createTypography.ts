import {
    INodeDefinition,
    Node,
    StringSchema,
    ToOutput,
} from "@tokens-studio/graph-engine";
import {  TokenTypographySchema } from "../schemas/index.js";
import type { TokenTypographyValue } from "@tokens-studio/types";


export default class CreateTypographyNode extends Node {
    static title = "Create a Typography token";
    static type = "studio.tokens.design.createTypography";
    static description = "Creates a composite typography value from inputs";


    declare outputs: ToOutput<{
        token: TokenTypographyValue
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("fontFamily", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("fontWeight", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("fontSize", {
            type: StringSchema,
            visible: true,
        });

        this.addInput("lineHeight", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("letterSpacing", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("paragraphSpacing", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("textDecoration", {
            type: StringSchema,
            visible: true,
        });
        this.addInput("textCase", {
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
