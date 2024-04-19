/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { ToInput } from "@/programmatic/input.js";
import { annotatedDynamicInputs } from '@/annotations/index.js';
import { NodeTypes } from "@/types.js";
import { Node, INodeDefinition } from "@/programmatic/node.js";
import { TextSchema } from "@/schemas/index.js";


export default class NodeDefinition extends Node {
    static title = "Inline";
    static type = NodeTypes.INLINE;

    declare inputs: ToInput<{
        src: string;
    }>;


    static description =
        "A dangerous node that allows you to inline the inputs to the outputs. This is useful for debugging and testing.";
    constructor(props: INodeDefinition) {
        super(props);

        this.annotations[annotatedDynamicInputs] = true;
        this.addInput("src", {
            type: TextSchema,
            visible: false,
        });
    }

    execute(): void | Promise<void> {
        const { src, ...rest } = this.getAllInputs();

        //@ts-ignore Yeah this is dangerous
        const executor = new Function(src);
        //Assume this does the rest
        executor.call(this);
    }
}
