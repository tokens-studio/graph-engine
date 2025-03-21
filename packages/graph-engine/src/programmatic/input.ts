import { GraphSchema } from '../schemas/index.js';
import { ISerializable } from './serializable.js';
import { Port } from './port.js';
import { action, makeObservable } from 'mobx';
import type { Node } from './node.js';

export interface IInputProps<NodeType extends Node = Node, T = any> {
	name: string;
	type: GraphSchema;
	value: T;
	node: NodeType;
	variadic?: boolean;
	annotations?: Record<string, any>;
}

export interface SerializedInput {
	name: string;
	annotations?: Record<string, any>;
}


export class Input<T extends Node = Node, V = any> extends Port<T> implements ISerializable<SerializedInput> {


	constructor(props: IInputProps<T, V>) {
		super(props);

		this.variadic = props.variadic || false;
		makeObservable(this, {
			deserialize: action
		});
	}
	/**
	 * Returns the underlying class of the input.
	 * @returns
	 */
	get factory(): typeof Input {
		//@ts-ignore
		return this.constructor;
	}

	serialize(): SerializedInput {
		const serialized = {
			name: this.name,
		} as SerializedInput;

		if (Object.keys(this.annotations).length > 0) {
			serialized.annotations = this.annotations;
		}

		return serialized;
	}

	deserialize(serialized: SerializedInput) {
		this.name = serialized.name;
		this.annotations = serialized.annotations || {};
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
export type ToInput<T extends Record<string, Node>> = {
	[P in keyof T]: Input<T[P]>;
};
