import { AnySchema, GraphSchema } from '@/schemas/index.js';
import { IPort, Port } from '@/programmatic/port.js';
import { Node } from '@/programmatic/node.js';
import { computed, makeObservable, observable } from 'mobx';


export const DATAFLOW_PORT = 2;

export interface IDataflowPort<V = any, T extends Node = Node>
	extends IPort<T> {
	value: V;
	type: GraphSchema;
}
export class DataFlowPort<V = any, T extends Node = Node> extends Port<T> {
	//Note that we need null values for the observable to work
	protected _dynamicType: GraphSchema | null = null;
	protected _type: GraphSchema = AnySchema;
	protected _value: V;
	pType = DATAFLOW_PORT;

	constructor(props: IDataflowPort<V, T>) {
		super(props);
		this._value = props.value;
		this._type = props.type;

		makeObservable(this, {
			//@ts-expect-error
			_value: observable.ref,
			_type: observable.ref,
			_dynamicType: observable.ref,
			value: computed,
			type: computed,
			dynamicType: computed
		});
	}

	set(value: V, type?: GraphSchema) {
		this._value = value;
		this._dynamicType = type || null;
	}

	get dynamicType() {
		return this._dynamicType;
	}

	/**
	 * Gets the current type . This might be different from the static type if the value is dynamic
	 * @returns
	 */
	get type(): GraphSchema {
		return this._dynamicType || this._type;
	}

	get value() {
		return this._value;
	}
}
