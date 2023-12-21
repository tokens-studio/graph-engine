import { GraphSchema } from "@/schemas/index.js";
import { Node } from "./node.js";
import { TypeDefinition } from "./node.js";
import { IPort } from "./port.js";
import getDefaults from "json-schema-defaults";
import { SerializedInput } from "@/index.js";
import { action, computed, makeObservable, observable } from "mobx";

export interface IInputProps {
  name: string;
  type: TypeDefinition;
  value?: any;
  node: Node;
}

export class Input<T = any> implements IPort {
  /**
   * Name to show in the side panel.Optional
   * */
  public readonly name: string;
  /** Type */
  protected _type: TypeDefinition;

  protected _value: T;
  /**
   * The parent node of this input
   */
  public node: Node;

  public visible: boolean = false;

  /**
   * The runtime type of the value. This might change if the value is dynamic, a union ,etc
   */
  protected _dynamicType?: GraphSchema;

  /**
   * Whether this is currently connected to an edge.
   * Included here to avoid having to traverse the graph to find out and help with observability
   */
  protected _connected: boolean;

  constructor(props: IInputProps) {
    this.name = props.name;
    this._type = props.type;
    this.visible = props.type.visible ?? false;
    this._value = props.value;
    this.node = props.node;
    makeObservable(this, {
      // @ts-ignore
      _value: observable,
      _dynamicType: observable,
      visible: observable,
      value: computed,
      dynamicType: computed,
      setValue: action,
      setConnected: action,
      setVisible: action,
      reset: action,
    });
  }

  setNode(node: Node) {
    this.node = node;
  }

  /**
   * Sets the value without a side effect. This should only be used internally
   * @param value
   */
  setValue(value: T, dynamicType?: GraphSchema) {
    this._value = value;
    this._dynamicType = dynamicType;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }
  setConnected(connected: boolean) {
    this._connected = connected;
  }

  get value(): T {
    return this._value;
  }

  get dynamicType() {
    return this._dynamicType;
  }

  get isConnected() {
    return this._connected;
  }

  /**
   * Resets the value of the input to the default value
   */
  reset() {
    return (this._value = getDefaults(this._type.type));
  }

  fullType(): TypeDefinition {
    return {
      ...this._type,
      type: this.type(),
    };
  }

  /**
   * Gets the current type . This might be different from the static type if the value is dynamic
   * @returns
   */
  type(): GraphSchema {
    return this._dynamicType || this._type.type;
  }

  serialize() {
    return {
      name: this.name,
      value: this.value,
      type: this.fullType(),
    } as SerializedInput;
  }

  deserialize(serialized: SerializedInput) {
    this._value = serialized.value;
  }
}
