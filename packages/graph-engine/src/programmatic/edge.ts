import { Annotated } from './annotated.js';
import { SerializedEdge } from '../index.js';
import { nanoid as uuid } from 'nanoid';

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

export const cloneEdge = (edge: Edge): Edge => {
	return new Edge({
		id: edge.id,
		source: edge.source,
		sourceHandle: edge.sourceHandle,
		target: edge.target,
		targetHandle: edge.targetHandle,
		annotations: { ...edge.annotations }
	});
};

export class Edge extends Annotated {
	id: string;
	source: string;
	sourceHandle: string;
	target: string;
	targetHandle: string;

	constructor(props: IEdge) {
		super(props);
		this.id = props.id || uuid();
		this.source = props.source;
		this.sourceHandle = props.sourceHandle;
		this.target = props.target;
		this.targetHandle = props.targetHandle;
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
