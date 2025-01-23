import { AnySchema, GraphSchema } from '@/schemas/index.js';
import { ControlFlowNode } from '../nodes/controlflow.js';
import { IPort, Port } from '../port.js';
import type { Node, TypeDefinition } from '../nodes/node.js';

export const CONTROL_PORT = 1;

export interface IControlflowPort<T extends Node = Node> extends IPort<T> {
	type?: GraphSchema;
}

export class ControlFlowPort<
	T extends ControlFlowNode = ControlFlowNode
> extends Port<T> {
	//Note that we need null values for the observable to work
	protected _dynamicType: GraphSchema | null = null;
	protected _type: GraphSchema;

	pType = CONTROL_PORT;
	constructor(props: IControlflowPort<T>) {
		super(props);
		this._type = props.type || AnySchema;
	}
	fullType(): TypeDefinition {
		return {
			type: this._type,
			visible: this.visible,
			variadic: this.variadic
		};
	}

	/**
	 * Gets the current type . This might be different from the static type if the value is dynamic
	 * @returns
	 */
	get type(): GraphSchema {
		return this._dynamicType || this._type;
	}
}
