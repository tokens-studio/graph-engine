import { GraphSchema } from '../schemas/index.js';
import { Node } from './node.js';
import { Port } from './port.js';
import { SerializedInput } from '../graph/types.js';
import { TypeDefinition } from './node.js';
import { action, makeObservable } from 'mobx';
import getDefaults from 'json-schema-defaults-esm';

export interface IInputProps<T = any> {
	name: string;
	type: GraphSchema;
	value: T;
	visible: boolean;
	node: Node;
	variadic?: boolean;
	annotations?: Record<string, any>;
}

export interface ISetValue {
	noPropagate?: boolean;
	type?: GraphSchema;
	forceStore?: boolean;
}

export class Input<T = any> extends Port<T> {
	/**
	 * Expects to have connections to this node done by enqueing the edge
	 */
	public readonly variadic: boolean;

	constructor(props: IInputProps<T>) {
		super(props);

		this.variadic = props.variadic || false;
		makeObservable(this, {
			setValue: action,
			reset: action,
			deserialize: action
		});
	}

	/**
	 * Sets the value without a side effect. This should only be used internally
	 * @param value
	 */
	setValue(value: T, opts?: ISetValue) {
		if (this.isConnected && !this.variadic && !opts?.forceStore) {
			if (opts?.type !== undefined) {
				this.handleTypeUpdate(opts.type);
			}

			if (!opts?.noPropagate) {
				this.node.getGraph()?.update(this.node.id);
			}
			return;
		}

		this._value = value;

		if (opts?.type !== undefined) {
			this.handleTypeUpdate(opts.type);
		}

		if (!opts?.noPropagate) {
			this.node.getGraph()?.update(this.node.id);
		}
	}

	private handleTypeUpdate(type: GraphSchema) {
		if (this._type?.$id !== undefined) {
			if (this._type?.$id !== type.$id) {
				this._dynamicType = type;
			}
		}
		//Otherwise do a structural comparison
		else if (JSON.stringify(this._type) !== JSON.stringify(type)) {
			const { variadic, _dynamicType } = this;

			// for variadic ports, we need to set the dynamic type depending on all the other connected types
			if (
				variadic &&
				_dynamicType &&
				JSON.stringify(_dynamicType) !== JSON.stringify(type)
			) {
				const graph = this.node.getGraph();
				const sourceNodesOutputTypes = this._edges.map(edge => {
					const outputs = graph.getNode(edge.source)!.outputs;
					return outputs[edge.sourceHandle].type;
				});

				const firstNodeTypeStringValue = JSON.stringify(
					sourceNodesOutputTypes[0]
				);
				if (
					sourceNodesOutputTypes.every(
						type => JSON.stringify(type) === firstNodeTypeStringValue
					)
				) {
					this._dynamicType = {
						type: 'array',
						items: sourceNodesOutputTypes[0]
					};
				} else {
					this._dynamicType = null;
				}
			} else {
				this._dynamicType = type;
			}
		}
	}

	/**
	 * Resets the value of the input to the default value
	 */
	reset() {
		this._dynamicType = null;
		return (this._value = getDefaults(this._type) as T);
	}

	/**
	 * Returns the underlying class of the input.
	 * @returns
	 */
	get factory(): typeof Input {
		//@ts-ignore
		return this.constructor;
	}

	clone(): Input<T> {
		const clonedInput = new this.factory({
			name: this.name,
			type: this.type,
			visible: this.visible,
			node: this.node,
			variadic: this.variadic,
			annotations: { ...this.annotations },
			value: this.value
		});

		return clonedInput;
	}

	fullType(): TypeDefinition {
		return {
			type: this._type,
			visible: this.visible,
			variadic: this.variadic
		};
	}

	serialize(): SerializedInput {
		const type = this.fullType();
		const serialized = {
			name: this.name,
			type: type.type
		} as SerializedInput;

		// Only include value in serialization if not a connected non-variadic input
		// This prevents redundant data storage in the serialized format
		if (!this.isConnected || this.variadic) {
			serialized.value = this.value;
		}

		if (this._dynamicType) {
			serialized.dynamicType = this._dynamicType;
		}

		//Try compact the serialization by omitting the value if its the default
		if (type.variadic) {
			serialized.variadic = true;
		}
		if (!type.visible) {
			serialized.visible = false;
		}

		if (Object.keys(this.annotations).length > 0) {
			serialized.annotations = this.annotations;
		}

		return serialized;
	}

	deserialize(serialized: SerializedInput) {
		this.visible = serialized.visible ?? true;
		this._dynamicType = serialized.dynamicType || null;
		this.annotations = serialized.annotations || {};

		// Only set the value if it's explicitly defined in the serialized data
		// This maintains compatibility with our optimization to not store values for connected inputs
		if ('value' in serialized) {
			this._value = serialized.value;
		}
	}

	override get value(): T {
		// for connected non-variadic inputs, values should come from connected outputs
		if (this.isConnected && !this.variadic && this._edges.length > 0) {
			const graph = this.node.getGraph();
			if (graph) {
				const edge = this._edges[0];
				return (
					graph.getNode(edge.source)?.outputs?.[edge.sourceHandle]?.value ??
					this._value
				);
			}
		}
		return this._value;
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
export type ToInput<T> = {
	[P in keyof T]: Input<T[P]>;
};
