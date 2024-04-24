import { v4 as uuid } from 'uuid';
import { makeObservable, observable } from "mobx";
import { SerializedEdge } from '..';

/**
 * Additional data stored on an edge
 */
export type VariadicEdgeData = {
    /**
     * The index of the edge in the variadic port
     */
    index?: number;
};
export interface IEdge {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    annotations?: Record<string, any>;

}


export class Edge {

    public annotations: Record<string, any> = {};
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;

    constructor(props: IEdge) {

        this.id = props.id || uuid();
        this.source = props.source;
        this.sourceHandle = props.sourceHandle;
        this.target = props.target;
        this.targetHandle = props.targetHandle;
        this.annotations = props.annotations || {};

        makeObservable(this, {
            annotations: observable,
        });
    }

    serialize(): SerializedEdge {
        return {
            id: this.id,
            source: this.source,
            sourceHandle: this.sourceHandle,
            target: this.target,
            targetHandle: this.targetHandle,
            annotations: this.annotations,
        }
    }
    static deserialize(props: SerializedEdge): Edge {
        return new Edge({
            id: props.id,
            source: props.source,
            sourceHandle: props.sourceHandle,
            target: props.target,
            targetHandle: props.targetHandle,
            annotations: props.annotations || {},
        });
    }

}
