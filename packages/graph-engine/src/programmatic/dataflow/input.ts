import { DataFlowCapability } from '@/capabilities/dataflow.js';
import { DataFlowPort } from './base.js';
import { GraphSchema } from '../../schemas/index.js';
import { Node } from '../nodes/node.js';
import { Output } from './output.js';
import { SerializedInput } from '../../graph/types.js';
import { TypeDefinition } from '../nodes/node.js';
import { action, makeObservable } from 'mobx';
import getDefaults from 'json-schema-defaults-esm';

export interface IInputProps<V = any, T extends Node = Node> {
	name: string;
	type: GraphSchema;
	value: V;
	visible?: boolean;
	node: T;
	variadic?: boolean;
	annotations?: Record<string, any>;
}

export interface ISetValue {
	noPropagate?: boolean;
	type?: GraphSchema;
}

export class Input<V = any, T extends Node = Node> extends DataFlowPort<V, T> {
	constructor(props: IInputProps<V, T>) {
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
	setValue(value: V, opts?: ISetValue) {
		this._value = value;
		// debugger;
		if (opts?.type !== undefined) {
			if (this._type?.$id !== undefined) {
				if (this._type?.$id !== opts.type.$id) {
					this._dynamicType = opts.type;
				}
			}
			//Otherwise do a structural comparison
			else if (JSON.stringify(this._type) !== JSON.stringify(opts.type)) {
				const { variadic, _dynamicType } = this;

				// for variadic ports, we need to set the dynamic type depending on all the other connected types
				if (
					variadic &&
					_dynamicType &&
					JSON.stringify(_dynamicType) !== JSON.stringify(opts.type)
				) {
					const graph = this.node.getGraph();
					const sourceNodesOutputTypes = this._edges.map(edge => {
						const outputs = graph.getNode(edge.source).outputs;
						return (outputs[edge.sourceHandle] as Output).type;
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
						this._dynamicType = undefined;
					}
				} else {
					this._dynamicType = opts.type;
				}
			}
		}
		if (!opts?.noPropagate) {
			(
				this.node.getGraph()?.capabilities.dataFlow as DataFlowCapability
			).update(this.node.id);
		}
	}

	/**
	 * Resets the value of the input to the default value
	 */
	reset() {
		this._dynamicType = undefined;
		return (this._value = getDefaults(this._type) as V);
	}

	/**
	 * Returns the underlying class of the input.
	 * @returns
	 */
	get factory(): typeof Input {
		//@ts-ignore
		return this.constructor;
	}

	clone(): Input<V, T> {
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
			value: this.value,
			type: type.type
		} as SerializedInput;

		if (this._dynamicType) {
			serialized.dynamicType = this._dynamicType;
		}

		//Try compact the serialization by omitting the value if its the default
		if (type.variadic) {
			serialized.variadic = true;
		}
		if (type.visible == false) {
			serialized.visible = false;
		}

		if (Object.keys(this.annotations).length > 0) {
			serialized.annotations = this.annotations;
		}

		return serialized;
	}

	deserialize(serialized: SerializedInput) {
		this.visible = serialized.visible ?? true;
		this._dynamicType = serialized.dynamicType || undefined;
		this.annotations = serialized.annotations || {};
		this._value = serialized.value;
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
