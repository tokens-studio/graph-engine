import { ControlFlowInput } from './input.js';
import { ControlFlowNode } from './node.js';
import { ControlFlowPort, IControlflowPort } from './basePort.js';
import { GraphSchema } from '@/schemas/index.js';

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
export type ToControlOutput<T> = {
	[P in keyof T]: ControlFlowOutput<T[P]>;
};

export class ControlFlowOutput<T = any> extends ControlFlowPort {
	constructor(props: IControlflowPort<ControlFlowNode>) {
		super(props);
	}
	/**
	 * Triggers the event listener attached to the input.
	 * @param val
	 */
	trigger(val: T, type?: GraphSchema) {
		this.node.getGraph().ripple(this, val, type);
	}
	connect(target: ControlFlowInput) {
		return this.node.getGraph().connect(this.node, this, target.node, target);
	}
}
