/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { AnySchema, NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition<T> extends Node {
    static title = "Delay";
    static type = 'studio.tokens.generic.delay';
    static description = "When trigger, it will output the provided value after a delay";

    declare inputs: ToInput<{
        value: T;
        delay: number;
    }>;
    declare outputs: ToOutput<{
        value: T;
    }>;

    _interval: NodeJS.Timer | null = null;
    constructor(props: INodeDefinition) {
        super(props);

        this.addInput("value", {
            type: AnySchema,
            visible: true,
        });
        this.addInput("delay", {
            type: {
                ...NumberSchema,
                default: 1000
            },
            visible: true,
        });
        this.addOutput("value", {
            type: AnySchema,
            visible: true,
        });
    }
    async execute() {
        const { delay } = this.getAllInputs();
        const raw = this.getRawInput("value");

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                this.setOutput("value", raw.value, raw.type);
                resolve();
            }, delay);
        });
    }
}
