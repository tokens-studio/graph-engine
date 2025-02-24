import { GraphSchema } from '../schemas/index.js';
import { Input } from './input.js';
import { Port } from './port.js';
import { action, makeObservable } from 'mobx';
import type { Node } from './node.js';

export interface IOutputProps<T = any> {
	name: string;
	type: GraphSchema;
	value: T;
	node: Node;
}

export interface ConnectionStatus {
	/**
	 * Whether the connection is valid
	 */
	valid: boolean;
}

export class Output<T = Node> extends Port<T> {
	constructor(props: IOutputProps<T>) {
		super(props);
		makeObservable(this, {
			set: action
		});
	}

	set(value: T, type?: GraphSchema) {
		this._value = value;
		this._dynamicType = type || null;
	}

	connect(target: Input) {
		const graph = this.node.getGraph();
		if (!graph) {
			return {
				valid: false
			};
		}

		return graph.connect(this.node, this, target.node, target);
	}

	/**
	 * Returns the underlying class of the input.
	 * @returns
	 */
	get factory(): typeof Output {
		//@ts-ignore
		return this.constructor;
	}

	clone(): Output<T> {
		const clonedOutput = new this.factory({
			name: this.name,
			type: this.type,
			value: this._value,
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
