import { GraphSchema } from '../schemas/index.js';
import { Input } from './input.js';
import { Node } from './node.js';
import { Port } from './port.js';
import { action, makeObservable } from 'mobx/dist/mobx.esm.production.min.js';

export interface IOutputProps<T = any> {
	name: string;
	type: GraphSchema;
	value: T;
	visible: boolean;
	node: Node;
}

export interface ConnectionStatus {
	/**
	 * Whether the connection is valid
	 */
	valid: boolean;
}

export class Output<T = any> extends Port<T> {
	constructor(props: IOutputProps<T>) {
		super(props);
		makeObservable(this, {
			set: action
		});
	}

	set(value: T, type?: GraphSchema) {
		this._value = value;
		this._dynamicType = type;

		this.node.getGraph()?.ripple(this);
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
