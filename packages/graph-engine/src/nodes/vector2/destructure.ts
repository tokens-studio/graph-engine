import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import {
    NumberSchema,
    Vec2Schema
} from "../../schemas/index.js";
import { Vec2 } from "../../index.js";

export default class NodeDefinition extends Node {
    static title = "Destructure vector2";
    static type = 'studio.tokens.vector2.destructure';
    static description =
        "Allows you to destructure a vector2 into its components";


    declare inputs: ToInput<{
        value: Vec2;
    }>;

    declare outputs: ToOutput<{
        x: number;
        y: string;
    }>;

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("value", {
            type: Vec2Schema,
            visible: true,
        });
        this.addOutput("x", {
            type: NumberSchema,
            visible: true,
        });
        this.addOutput("y", {
            type: NumberSchema,
            visible: true,
        });
    }

    execute(): void | Promise<void> {
        const { value } = this.getAllInputs();

        this.setOutput("x", value[0]);
        this.setOutput("y", value[1]);
    }
}
