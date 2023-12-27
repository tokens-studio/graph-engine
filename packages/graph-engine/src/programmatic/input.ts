import { GraphSchema } from "@/schemas/index.js";
import { Node } from "./node.js";
import { TypeDefinition } from "./node.js";
import { Port } from "./port.js";
import getDefaults from "json-schema-defaults";
import { Edge, SerializedInput } from "@/index.js";
import { action, computed, makeObservable, observable } from "mobx";

export interface IInputProps<T = any> {
  name: string;
  type: GraphSchema;
  value: T;
  visible: boolean;
  node: Node;
}

export interface ISetValue {
  noPropagate?: boolean;
  type?: GraphSchema;
}

export class Input<T = any> extends Port<T> {
  constructor(props: IInputProps<T>) {
    super(props);

    makeObservable(this, {
      setValue: action,
      reset: action,
    });
  }

  /**
   * Sets the value without a side effect. This should only be used internally
   * @param value
   */
  setValue(value: T, opts?: ISetValue) {
    this._value = value;
    this._dynamicType = opts?.type;

    if (!opts?.noPropagate) {
      this.node.getGraph()?.update(this.node.id);
    }
  }

  /**
   * Resets the value of the input to the default value
   */
  reset() {
    return (this._value = getDefaults(this._type));
  }

  fullType(): TypeDefinition {
    return {
      type: this._type,
      visible: this.visible,
      variadic: false,
    };
  }

  serialize(): SerializedInput {
    return {
      name: this.name,
      value: this.value,
      visible: this.visible,
      type: this.fullType(),
    } as SerializedInput;
  }

  deserialize(serialized: SerializedInput) {
    this._value = serialized.value;
  }
}
