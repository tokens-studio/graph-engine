import { AnySchema, StringSchema, createVariadicSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import deepMerge from 'deepmerge';


const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

const combineMerge = (target, source, options) => {
    const destination = target.slice()

    source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
            destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
        } else if (options.isMergeableObject(item)) {
            destination[index] = deepMerge(target[index], item, options)
        } else if (target.indexOf(item) === -1) {
            destination.push(item)
        }
    })
    return destination
}

const CONCAT = 'concat';
const MERGE = 'merge';
const COMBINE = 'combine';

export default class NodeDefinition extends Node {
    static title = "Merge objects";
    static type = "studio.tokens.generic.mergeObjects";
    static description = "Merges an array of objects into a single object, with later objects taking precedence.";

    declare inputs: ToInput<{
        objects: object[];
        concatArray: 'concat' | 'merge' | 'combine';
    }>;
    declare outputs: ToOutput<{
        value: object;
    }>;



    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("objects", {
            type: {
                ...createVariadicSchema(AnySchema),
                default: [],
            },
            variadic: true,
            visible: true,
        });
        this.addInput("concatArray", {
            type: {
                ...StringSchema,
                enum: [CONCAT, MERGE, COMBINE],
                default: CONCAT,
            },
        });
        this.addOutput("value", {
            type: AnySchema,
            visible: true,
        });
    }

    execute(): void | Promise<void> {
        const { objects, concatArray } = this.getAllInputs();

        let opts = {};
        if (concatArray === MERGE) {
            opts = { arrayMerge: overwriteMerge };
        } else if (concatArray === COMBINE) {
            opts = { arrayMerge: combineMerge };
        }

        const flattened = deepMerge.all(objects, opts);
        this.setOutput("value", flattened);
    }
}
