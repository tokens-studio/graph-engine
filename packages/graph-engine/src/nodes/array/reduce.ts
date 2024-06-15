import { AnyArraySchema, AnySchema, NumberSchema } from "../../schemas/index.js";
import { Input, ToInput, ToOutput } from "../../programmatic/index.js";
import { NodeTypes } from "../../types.js";
import { annotatedDynamicInputs, hideFromParentSubgraph } from "../../annotations/index.js";
import { extractArray } from "../../schemas/utils.js";
import SubgraphNode from "../generic/subgraph.js";


const filtered = ['array', 'accumulator'];

export default class ReduceSubgraph<T, V> extends SubgraphNode {
    static title = "Array Reduce";
    static type = 'tokens.studio.array.reduce';
    static description = "Allows you to reduce an array of items";

    declare inputs: ToInput<{
        array: T[];
    }>

    declare outputs: ToOutput<{
        value: V
    }>

    constructor(props) {
        super(props);

        //Create the hardcoded input values in the innergraph
        const input = Object.values(this._innerGraph.nodes).find((x) => x.factory.type === NodeTypes.INPUT);

        if (!input) throw new Error("No input node found in subgraph");

        input.annotations[annotatedDynamicInputs] = true;

        input.addInput("value", {
            type: AnySchema,
            visible: false,
            annotations: {
                "ui.editable": false,
                "ui.hidden": true,
                [hideFromParentSubgraph]: true
            }
        });

        //Do not allow these to be edited 
        input.addInput("index", {
            type: NumberSchema,
            visible: false,
            annotations: {
                "ui.editable": false,
                [hideFromParentSubgraph]: true
            }
        });

        input.addInput("accumulator", {
            type: NumberSchema,
            visible: false,
            annotations: {
                "ui.editable": false,
                [hideFromParentSubgraph]: true
            }
        });



        this.addInput("array", {
            type: AnyArraySchema,
            visible: true,
        });
        this.inputs["array"].annotations["ui.editable"] = false

        this.addInput('accumulator', {
            type: AnySchema,
            visible: true
        });


        this.addOutput("value", {
            type: AnySchema,
            visible: true,
        });
    }

    async execute() {
        const input = this.getRawInput("array");
        const accumulator = this.getRawInput("accumulator");

        const inputNode = Object.values(this._innerGraph.nodes).find((x) => x.factory.type === NodeTypes.INPUT);

        const otherInputs: [string, Input<any>][] = Object.keys(this.inputs).filter(x => !filtered.includes(x)).map(x => [x, this.getRawInput(x)]);

        const other = Object.fromEntries(otherInputs.map(([name, x]) => [name, {
            value: x.value,
            type: x.type
        }]));

        //Todo optimize this to run in parallel. We have to run this in series because the inner graph is not designed to run in parallel

        const output = await (input.value as any[]).reduce(async (acc, item, i) => {

            const previousAcc = await acc;
            const result = await this._innerGraph.execute({
                //By default this is any so we need to overwrite it with its runtime type
                inputs: {
                    value: {
                        value: item,
                        type: extractArray(input.type)
                    },
                    index: {
                        value: i
                    },
                    accumulator: previousAcc,
                    ...other
                }
            });
            if (!result.output) throw new Error("No output from subgraph");
            return result.output?.value;
        }, Promise.resolve(accumulator));
        this.setOutput("value", output.value, output.type);
    }
}
