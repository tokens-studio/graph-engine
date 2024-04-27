import { GraphSchema } from "@/schemas/index.js";
import { Node } from "./node.js";
import { TypeDefinition } from "./node.js";
import { Port } from "./port.js";
import getDefaults from "json-schema-defaults";
import { SerializedInput } from "@/index.js";
import { action, makeObservable } from "mobx";

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
      deserialize: action,
    });
  }

  /**
   * Sets the value without a side effect. This should only be used internally
   * @param value
   */
  setValue(value: T, opts?: ISetValue) {
    this._value = value;
    if (opts?.type !== undefined) {
      this._dynamicType = opts?.type;
    }
    if (!opts?.noPropagate) {
      this.node.getGraph()?.update(this.node.id);
    }
  }

  /**
   * Resets the value of the input to the default value
   */
  reset() {
    this._dynamicType = undefined;
    return (this._value = getDefaults(this._type));
  }

  fullType(): TypeDefinition {
    return {
      type: this._type,
      visible: this.visible,
      variadic: this.variadic,
    };
  }

  serialize(): SerializedInput {
    const type = this.fullType();
    const serialized = {
      name: this.name,
      value: this.value,
      type: type.type,
    } as SerializedInput;

    if (this._dynamicType) {
      serialized.dynamicType = this._dynamicType;
    }


    //Try compact the serialization by omitting the value if its the default
    if (type.variadic) {
      serialized.variadic = true;
    }
    if (type.visible) {
      serialized.visible = true;
    }

    if (Object.keys(this.annotations).length > 0) {
      serialized.annotations = this.annotations;
    }

    return serialized;
  }

  deserialize(serialized: SerializedInput) {
    this.visible = serialized.visible || false;
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