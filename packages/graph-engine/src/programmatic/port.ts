import { Annotated } from '../types/annotated.js';
import { computed, makeObservable, observable } from 'mobx';
import type { Edge } from './edge.js';
import type { Node } from './node.js';

export interface IPort<T extends Node> {
	name: string;
	node: T;
	annotations?: Record<string, any>;
}

export const type = {
	name: 'Unknown'
}

export type PortType = {
	name: string;
}

export class Port<T extends Node = Node> extends Annotated {
	/**
	 * The name of the port on the attached node
	 * */
	public  name: string;
	/**
	 * If the port is variadic, meaning it can accept multiple incoming edges. Useless for outputs
	 */
	public variadic?: boolean;
	public node: T;
	/**
	 * Some identifier to help identify different ports in a system
	 */
	portType: PortType = type;

	/**
	 * Unless the port is variadic this will always be a single edge on an input port, however on an output port it can be multiple edges
	 */
	_edges: Edge[] = [];

	constructor(props: IPort<T>) {
		super(props);
		this.name = props.name;
		this.node = props.node;

		makeObservable(this, {
			_edges: observable.ref,
			isConnected: computed,
		});
	}

	get isConnected() {
		return this._edges.length > 0;
	}

	/**
	 * This is expected to be overriden with the correct implementation to handle cloning your port
	 * @returns
	 */
	clone(): Port<T> {
		//@ts-ignore
		return new this.constructor();
	}
}
