import { Node, NumberSchema } from '@tokens-studio/graph-engine';
import type { INodeDefinition, ToInput, ToOutput } from '@tokens-studio/graph-engine';

export default class NodeDefinition extends Node {
    static title = 'Add';
    static type = 'com.my.add';
    static description = 'Add node allows you to add two numbers.';
    declare inputs: ToInput<{
        a: number;
        b: number;
    }>;
    declare outputs: ToOutput<{
        value: number;
    }>;
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput('a', {
            type: NumberSchema
        });
        this.addInput('b', {
            type: NumberSchema
        });
        this.addOutput('value', {
            type: NumberSchema
        });
    }

    execute(): void | Promise<void> {
        const { a, b } = this.getAllInputs();
        this.outputs.value.set( a + b);
    }
}
