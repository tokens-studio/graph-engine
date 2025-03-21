import { GraphSchema } from '../schemas/index.js';
import { Input } from './input.js';
import { Port } from './port.js';
import type { Node } from './node.js';

export interface IOutputProps<NodeType extends Node = Node, V = any> {
	name: string;
	type: GraphSchema;
	value: V;
	node: NodeType;
}

export interface ConnectionStatus {
	/**
	 * Whether the connection is valid
	 */
	valid: boolean;
}

export class Output<T extends Node = Node, V = any> extends Port<T> {
	constructor(props: IOutputProps<T, V>) {
		super(props);
	}

	connect(target: Input) {
		const graph = this.node.getGraph();
		if (!graph) {
			return null;
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
	[P in keyof T]: Output<Node, T[P]>;
};
