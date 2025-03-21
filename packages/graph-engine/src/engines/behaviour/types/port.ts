import {  GraphSchema } from '@/schemas/index.js';
import {  IPort, Port } from '@/programmatic/port.js';
import { Node } from '@/programmatic/node.js';
import { computed, makeObservable, observable } from 'mobx';




export class BehaviourPort<V = any, T extends Node = Node> extends Port<T> {
	protected _value: V;

	constructor(props: IPort<T>) {
		super(props);
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
	}


	get value() {
		return this._value;
	}
}
