/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition<T> extends Node {
    static title = "Time";
    static type = 'studio.tokens.generic.time';
    static description = "Provides the current time each tick";

    declare inputs: ToInput<{
        value: T;
    }>;
    declare outputs: ToOutput<{
        value: T;
    }>;

    _interval: NodeJS.Timer | null = null;
    constructor(props: INodeDefinition) {
        super(props);

        this
        this.addOutput("value", {
            type: NumberSchema,
            visible: true,
        });
    }

    onStart = () => {
        if (this._interval) {
            clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            this.run();
        }, 1000);
    };
    onStop = () => {
        if (this._interval) {
            clearInterval(this._interval);
        }
    };


    execute(): void | Promise<void> {
        this.setOutput("value", Date.now());
    }
}
