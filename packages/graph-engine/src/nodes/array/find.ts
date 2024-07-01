import { BooleanSchema, NumberSchema } from "../../schemas/index.js";
import { Graph } from "../../graph/graph.js";
import { INodeDefinition } from "../../programmatic/node.js";
import { Input, ToInput, ToOutput } from "../../programmatic/index.js";
import { extractArray } from "../../schemas/utils.js";
import Filter from './filter.js';


export interface IArraySubgraph extends INodeDefinition {
    innerGraph?: Graph;
}

export default class ArraySubgraph<T, T> extends Filter<T, T> {
    static title = "Array find";
    static type = 'tokens.studio.array.find';
    static description = "Finds an item in an array";


    declare inputs: ToInput<{
        array: T[];
    }>

    declare outputs: ToOutput<{
        value: T
        found: boolean
        index: number
    }>

    constructor(props: IArraySubgraph) {
        super(props);

        this.addOutput("index", {
            type: NumberSchema,
            visible: true,
        });

        this.addOutput("found", {
            type: BooleanSchema,
            visible: true,
        });
    }

    async execute() {
        const input = this.getRawInput("array");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const otherInputs: [string, Input<any>][] = Object.keys(this.inputs).filter(x => x !== "array").map(x => [x, this.getRawInput(x)]);
        const other = Object.fromEntries(otherInputs.map(([name, x]) => [name, {
            value: x.value,
            type: x.type
        }]));

        //Todo optimize this to run in parallel. We have to run this in series because the inner graph is not designed to run in parallel
        const itemType = extractArray(input.type);
        let found = false;
        let output = undefined
        let index = 0;
        for (const element of input.value) {

            const result = await this._innerGraph.execute({
                //By default this is any so we need to overwrite it with its runtime type
                inputs: {
                    value: {
                        value: element,
                        type: itemType
                    },
                    length: {
                        value: input.value.length
                    },
                    index: {
                        value: index++
                    },
                    ...other
                }
            });

            if (!result.output) throw new Error("No output from subgraph");

            if (result.output.matches.value === true) {
                found = true;
                output = element;
                break;
            }
        }

        this.setOutput("found", found);
        this.setOutput("index", found ? index : -1);
        this.setOutput("value", output, input.type.items);
    }

    override serialize() {
        const serialized = super.serialize();
        return {
            ...serialized,
            innergraph: this._innerGraph.serialize(),
        };
    }

    static override deserialize(opts) {
        const innerGraph = new Graph().deserialize(opts.serialized.innergraph, opts.lookup);
        const node = super.deserialize({
            ...opts,
            innerGraph
        });
        return node;
    }

}
