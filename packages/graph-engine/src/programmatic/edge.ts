import { SerializedEdge } from '../index.js';
import { makeObservable, observable } from 'mobx';
import { v4 as uuid } from 'uuid';

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
			annotations: observable
		});
	}

	serialize(): SerializedEdge {
		const serialized = {
			id: this.id,
			source: this.source,
			sourceHandle: this.sourceHandle,
			target: this.target,
			targetHandle: this.targetHandle
		} as SerializedEdge;
		if (Object.keys(this.annotations).length > 0) {
			serialized.annotations = this.annotations;
		}
		return serialized;
	}
	static deserialize(props: SerializedEdge): Edge {
		return new Edge({
			id: props.id,
			source: props.source,
			sourceHandle: props.sourceHandle,
			target: props.target,
			targetHandle: props.targetHandle,
			annotations: props.annotations || {}
		});
	}
}
