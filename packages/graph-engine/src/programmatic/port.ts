import { AnySchema, GraphSchema } from "../schemas/index.js";
import { Node } from "./node.js";
import { action, computed, makeObservable, observable } from "mobx";
import { Edge } from "./edge.js";

export interface IPort<T = any> {
  name: string;
  visible: boolean;
  node: Node;
  type: GraphSchema;
  value: T;
  annotations?: Record<string, any>;
}

export class Port<T = any> {
  /**
   * Name to show in the side panel.Optional
   * */
  public readonly name: string;
  public visible: boolean = false;
  public node: Node;
  protected _dynamicType?: GraphSchema;
  protected _type: GraphSchema = AnySchema;
  protected _value: T;
  // Used to store arbitrary meta data. Most commonly used in the UI
  public annotations = {} as Record<string, any>;
  /**
   * Unless the port is variadic this will always be a single edge on an input port, however on an output port it can be multiple edges
   */
  _edges: Edge[] = [];

  constructor(props: IPort<T>) {
    this.name = props.name;
    this.visible = props.visible ?? false;
    this.node = props.node;
    this._type = props.type;
    this._value = props.value;
    this.annotations = props.annotations || {};

    makeObservable(this, {
      //@ts-ignore
      _type: observable,
      _dynamicType: observable,
      _value: observable,
      _edges: observable,
      visible: observable,
      annotations: observable,
      type: computed,
      value: computed,
      isConnected: computed,
      dynamicType: computed,
      setVisible: action,
    });
  }

  get isConnected() {
    return this._edges.length > 0;
  }

  get dynamicType() {
    return this._dynamicType;
  }
  get value() {
    return this._value;
  }

  /**
   * Gets the current type . This might be different from the static type if the value is dynamic
   * @returns
   */
  get type(): GraphSchema {
    return this._dynamicType || this._type;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  setNode(node: Node) {
    this.node = node;
  }
}
