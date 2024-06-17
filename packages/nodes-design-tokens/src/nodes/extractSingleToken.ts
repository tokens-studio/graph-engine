import { BooleanSchema, INodeDefinition, Node, StringSchema } from '@tokens-studio/graph-engine'
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "../schemas/index.js";
import { arrayOf } from "../schemas/utils.js";

export default class ExtractTokenNode extends Node {
    static title = "Extract token ";
    static type = 'studio.tokens.design.extractToken';
    static description = "Extracts a token from a token set";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("tokens", {
            type: arrayOf(TokenSchema),
        });
        this.addInput("name", {
            type: StringSchema,
        });
        this.addOutput('found', {
            type: BooleanSchema,
            visible: true,
        });
        this.addOutput("token", {
            type: TokenSchema,
            visible: true,
        });
    }

    async execute() {
        const { tokens, name } = this.getAllInputs();

        const token = tokens.find((token: SingleToken) => token.name === name);
        this.setOutput("token", token);
        this.setOutput("found", !!token);
    }
}

