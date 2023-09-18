import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.JOIN_STRING

export type NamedInput = {
    array: string[];
    separator: string;
};

export const process = (input: NamedInput) => {
    const { array, separator } = input;
    return { output: array.join(separator) };
};



export const node: NodeDefinition<NamedInput> = {
    type,
    process,
};