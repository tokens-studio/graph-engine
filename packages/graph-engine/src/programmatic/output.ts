import { Graph, TypeDefinition } from "@/index.js";
import { Input } from "./input.js";
import { Node } from "./node.js";
import { IPort } from "./port.js";
import { GraphSchema } from "@/schemas/index.js";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";

export interface IOutputProps {
  id?: string;
  name: string;
  type: TypeDefinition;
  value?: any;
  node: Node;
}

export class Output<T = any> implements IPort {
  /** Type */
  public readonly name: string;
  protected _type: TypeDefinition;

  protected _value: T;

  public node: Node;
  /**
   * Whether this port has a dynamic output
   */
  private _isDynamic: boolean = false;

  /**
   * Whether to show this Output in the side panel
   */
  public visible: boolean = true;

  /**
   * The runtime type of the value. This might change if the value is dynamic, a union ,etc
   */
  private dynamicType?: GraphSchema;

  constructor(props: IOutputProps) {
    this._type = props.type;
    this._value = props.value;
    this.name = props.name;
    this.node = props.node;
    this.visible = props.type.visible ?? true;
    makeObservable(this, {
      // @ts-ignore
      _value: observable,
      visible: observable,
      value: computed,
      set: action,
      setVisible: action,
    });
  }

  setNode(node: Node) {
    this.node = node;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  set(value: T, type?: GraphSchema) {
    this._value = value;

    this.dynamicType = type;
  }

  /**
   * Gets the type of the output. The runtime type might be different from the static type
   * @returns
   */
  get type() {
    return this.dynamicType || this._type.type;
  }

  get value() {
    return this._value;
  }

  /**
   * Use a key to access dynamic values off the port
   * @param target
   * @param key
   */
  connect(target: Input, key: string = "") {
    if (this._isDynamic && key === "") {
      throw new Error("Cannot connect to dynamic output without key");
    }
    const graph = this.node.getGraph();
    if (!graph) {
      return false;
    }

    graph.connect(this.node, this, target.node, target, key);
  }
}
