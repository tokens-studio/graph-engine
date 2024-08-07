import { DataFlowPort } from './base.js';
import { GraphSchema } from '../../schemas/index.js';
import { Input } from './input.js';
import { Node } from '../nodes/node.js';
import { action, makeObservable } from 'mobx';

export interface IOutputProps<V = any, T extends Node = Node> {
	name: string;
	type: GraphSchema;
	value: V;
	visible?: boolean;
	node: T;
}

export interface ConnectionStatus {
	/**
	 * Whether the connection is valid
	 */
	valid: boolean;
}

export class Output<V = any, T extends Node = Node> extends DataFlowPort<V, T> {
	constructor(props: IOutputProps<V, T>) {
		super(props);
		makeObservable(this, {
			set: action
		});
	}

	set(value: V, type?: GraphSchema) {
		this._value = value;
		this._dynamicType = type;
	}

	connect(target: Input<V>) {
		return this.node.getGraph().connect(this.node, this, target.node, target);
	}

	/**
	 * Returns the underlying class of the input.
	 * @returns
	 */
	get factory(): typeof Output {
		//@ts-ignore
		return this.constructor;
	}

	dispose() {
		const graph = this.node.getGraph();
		if (graph) {
			graph.outEdges(this.node.id, this.name).forEach(edge => {
				if (edge.id) {
					return;
				}
				graph?.removeEdge(edge.id);
			});
		}
	}

	clone(): Output<V, T> {
		const clonedOutput = new this.factory({
			name: this.name,
			type: this.type,
			value: this._value,
			visible: this.visible,
			node: this.node
		});

		clonedOutput._dynamicType = this._dynamicType;
		clonedOutput._edges = [...this._edges];

		return clonedOutput;
	}
}

/**
 * Converts a type definition to a map of inputs
 * @example
 * ```ts
 * type myType = {
 * a: number,
 * b: string
 * }
 * type myInputs = ToInput<myType>
 * ```
 */
export type ToOutput<T> = {
	[P in keyof T]: Output<T[P]>;
};
