
import { Input } from "../input/index.js";
import { Output } from "../output/index.js";
import { z } from 'zod';

import pkg from 'uuid';
import { Graph, SerializedNode } from "@/index.js";
const { v4: uuid } = pkg;

export interface INodeDefinition {
    id: string;
    inputs?: Record<string, Input>;
    outputs?: Record<string, Output>
}


export class Node {
    /**
     * Unique instance specific identifier
     */
    readonly id: string;
    public static readonly description?: string;

    static readonly type: string;
    public inputs: Record<string, Input> = {};
    public outputs: Record<string, Output> = {};

    static input: Record<string, Input> = {};

    private _graph: Graph;

    constructor(props: INodeDefinition) {
        this.id = props.id || uuid();


        //Connect the values with the definition
        Object.values(this.inputs).forEach(input => input.setNode(this));
        Object.values(this.outputs).forEach(output => output.setNode(this));
    }

    execute(): Promise<void> | void {
        return null;
    };

    static inspect(): string {
        return {
            type: this.type,
            description: this.description,
        }
    }

    public setGraph(graph: Graph) {
        this._graph = graph;
    }

    public serialize(): SerializedNode {
        return {
            id: this.id,
            type: this.type,
            inputs: Object.fromEntries(Object.entries(this.inputs).map(([key, value]) => [key, value.serialize()])),
        }

    }

    /**
     * How to deserialize the node
     * @param serialized 
     * @returns 
     */
    public static deserialize(serialized: SerializedNode): Node {
        return new this({
            id: serialized.id,
            inputs: Object.fromEntries(Object.entries(serialized.inputs).map(([key, value]) => [key, Input.deserialize(value)])),
        });
    }

    protected getAllInputs = () => {
        return Object.fromEntries(Object.entries(this.inputs).map(([key, value]) => [key, value.get()]));
    }

    /**
     * Returns a JSON representation of the output values without calculating them
     * @returns 
     */
    public getOutput() {
        return Object.fromEntries(Object.entries(this.outputs).map(([key, value]) => [key, value.value]));
    }

}

export interface NodeFactory {
    deserialize(serialized: SerializedNode): Node
}


const AnySchema = z.array(z.number());



class InputNode extends Node {

    type = "input"
    inputs = {
        value: new Input<typeof AnySchema>({
            type: AnySchema
        })
    }
    outputs = {
        value: new Output<typeof AnySchema>({
            type: AnySchema
        })
    }

    execute(): void {

        console.log(this.inputs.value.type.describe())

        this.outputs.value.set(this.inputs.value.get());
    }

}

