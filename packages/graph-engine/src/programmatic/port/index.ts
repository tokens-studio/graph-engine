import { IPortProps, IPortSerialized } from "./types.js";
import { v4 as uuid } from 'uuid';
import { Type } from "../types/index.js";

export class Port<TType extends Type, TNode extends Node = Node> {
    /** Unique Identifier */
    public id: string;
    /** Associated Node */
    public node: TNode;
    /** Port Name */
    public name: string;
    /** Port Value Type */
    public type: TType;

    constructor(node: TNode, props: IPortProps<TType>) {
        this.node = node;
        this.id = props.id || uuid();
        this.name = props.name;
        this.type = props.type;
    }

    /** Indicates if Port is connected */
    public get connected(): boolean {
        return [...this.node.context.connections.values()].some(
            connection => connection.from.id === this.id || connection.to.id === this.id
        );
    }

    /** Serializes Port */
    public toJSON(): IPortSerialized<TType> {
        return {
            id: this.id,
            name: this.name,
            type: this.type
        };
    }
}

