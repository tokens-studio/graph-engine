import { Annotated } from './annotated.js';
import { Edge } from './edge.js';
import { Node } from './nodes/node.js';
import { action, computed, makeObservable, observable } from 'mobx';

export interface IPort<T extends Node> {
	name: string;
	visible?: boolean;
	node: T;
	annotations?: Record<string, any>;
}

export class Port<T extends Node = Node> extends Annotated {
	/**
	 * Name to show in the side panel.Optional
	 * */
	public readonly name: string;
	public visible: boolean = false;
	/**
	 * If the port is variadic, meaning it can accept multiple incoming edges. Useless for outputs
	 */
	public variadic?: boolean;
	public node: T;
	/**
	 * Never change this. This is used to dynamicly determine the type of the port
	 */
	pType = 0;

	/**
	 * Unless the port is variadic this will always be a single edge on an input port, however on an output port it can be multiple edges
	 */
	_edges: Edge[] = [];

	constructor(props: IPort<T>) {
		super(props);
		this.name = props.name;
		this.visible = props.visible ?? true;
		this.node = props.node;

		makeObservable(this, {
			_edges: observable.ref,
			visible: observable.ref,
			isConnected: computed,
			setVisible: action
		});
	}

	get isConnected() {
		return this._edges.length > 0;
	}

	setVisible(visible: boolean) {
		this.visible = visible;
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
