import { AnySchema, GraphSchema } from '../schemas/index.js';
import { Edge } from './edge.js';
import { Node } from './node.js';
import { action, computed, makeObservable, observable } from 'mobx';

export interface IPort<T = any> {
	name: string;
	visible: boolean;
	node: Node;
	type: GraphSchema;
	value: T;
	annotations?: Record<string, any>;
}

export class Port<T = any> {
	/**
	 * Name to show in the side panel.Optional
	 * */
	public readonly name: string;
	public visible: boolean = false;
	public node: Node;
	//Note that we need null values for the observable to work
	protected _dynamicType: GraphSchema | null = null;
	protected _type: GraphSchema = AnySchema;
	protected _value: T;
	// Used to store arbitrary meta data. Most commonly used in the UI
	public annotations = {} as Record<string, any>;
	/**
	 * Unless the port is variadic this will always be a single edge on an input port, however on an output port it can be multiple edges
	 */
	_edges: Edge[] = [];

	constructor(props: IPort<T>) {
		this.name = props.name;
		this.visible = props.visible == false ? false : true;
		this.node = props.node;
		this._type = props.type;
		this._value = props.value;
		this.annotations = props.annotations || {};

		makeObservable(this, {
			//@ts-ignore
			_type: observable.ref,
			_dynamicType: observable.ref,
			_value: observable.ref,
			_edges: observable.shallow,
			visible: observable.ref,
			annotations: observable.shallow,
			type: computed,
			value: computed,
			isConnected: computed,
			dynamicType: computed,
			setVisible: action,
			setType: action
		});
	}

	get isConnected() {
		return this._edges.length > 0;
	}

	get dynamicType() {
		return this._dynamicType;
	}
	get value(): T {
		return this._value;
	}

	/**
	 * Gets the current type . This might be different from the static type if the value is dynamic
	 * @returns
	 */
	get type(): GraphSchema {
		return this._dynamicType || this._type;
	}

	setVisible(visible: boolean) {
		this.visible = visible;
	}

	setNode(node: Node) {
		this.node = node;
	}

	setType(type: GraphSchema) {
		this._dynamicType = type;
	}
}
