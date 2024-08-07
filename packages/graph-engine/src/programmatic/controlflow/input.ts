import { ControlFlowNode } from '../nodes/controlflow.js';
import { ControlFlowPort } from './base.js';
import { GraphSchema } from '@/schemas/index.js';
import { IPort } from '../port.js';

/**
 * Converts a type definition to a map of ControlFlowInputs
 * @example
 * ```ts
 * type myType = {
 *   a: number,
 *   b: string
 * }
 * type myInputs = ToControlInput<myType>
 * ```
 */
export type ToControlInput<T> = {
	[P in keyof T]: ControlFlowInput<T[P]>;
};

export type ControlFlowTriggerFunction<V> = (
	val: V,
	type?: GraphSchema
) => void;

export interface IControlFlowInput<V> extends IPort<ControlFlowNode> {
	on: ControlFlowTriggerFunction<V>;
	type?: GraphSchema;
}

export class ControlFlowInput<V = any> extends ControlFlowPort {
	protected _cb: ControlFlowTriggerFunction<V>;

	constructor(props: IControlFlowInput<V>) {
		super(props);
		this._cb = props.on;
	}
	/**
	 * Triggers the event listener attached to the input.
	 * @param val
	 */
	async trigger(val: V, type?: GraphSchema) {
		return this._cb?.(val, type);
	}
}
