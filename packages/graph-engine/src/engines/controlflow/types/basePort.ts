import { AnySchema, GraphSchema } from '@/schemas/index.js';
import { ControlFlowNode } from './node.js';
import { IPort, Port } from '@/programmatic/port.js';
import { Node, TypeDefinition } from '@/programmatic/node.js';

export interface IControlflowPort<T extends Node = Node> extends IPort<T> {
	type?: GraphSchema;
}

export const CONTROL_PORT_TYPE = {
	name: 'Controlflow'
};


export class ControlFlowPort<
	T extends ControlFlowNode = ControlFlowNode
> extends Port<T> {
	//Note that we need null values for the observable to work
	protected _dynamicType?: GraphSchema = undefined;
	protected _type: GraphSchema;

	portType = CONTROL_PORT_TYPE;
	constructor(props: IControlflowPort<T>) {
		super(props);
		this._type = props.type || AnySchema;
	}
	fullType(): TypeDefinition {
		return {
			type: this._type,
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
