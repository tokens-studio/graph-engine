import { Edge } from './edge.js';
import { Node } from './nodes/node.js';
import { action, computed, makeObservable, observable } from 'mobx';

export interface IPort {
	name: string;
	visible: boolean;
	node: Node;
	annotations?: Record<string, any>;
}

export class Port {
	/**
	 * Name to show in the side panel.Optional
	 * */
	public readonly name: string;
	public visible: boolean = false;
	public node: Node;

	// Used to store arbitrary meta data. Most commonly used in the UI
	public annotations = {} as Record<string, any>;
	/**
	 * Unless the port is variadic this will always be a single edge on an input port, however on an output port it can be multiple edges
	 */
	_edges: Edge[] = [];

	constructor(props: IPort) {
		this.name = props.name;
		this.visible = props.visible ?? false;
		this.node = props.node;

		this.annotations = props.annotations || {};

		makeObservable(this, {
			//@ts-ignore
			_edges: observable.shallow,
			visible: observable.ref,
			annotations: observable.shallow,
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

	setNode(node: Node) {
		this.node = node;
	}
}
