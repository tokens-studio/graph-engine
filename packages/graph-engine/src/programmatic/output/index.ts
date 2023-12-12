import { Graph, TypeDefinition } from "@/index.js";

import { Input } from "../input/index.js";
import { Node } from "../node/index.js";
import { Type } from "../types/index.js";

export interface IOutputProps {
  id?: string;
  name?: string;
  type: TypeDefinition;
  value?: any;
}

export class Output {
  /** Type */
  public type: TypeDefinition;
  public value: any;
  public graph: Graph;
  public node: Node;
  /**
   * Whether this port has a dynamic output
   */
  private _isDynamic: boolean = false;

  private dynamicValues: Map<string, any> = new Map();

  /**
   * Whether to show this Output in the side panel
   */
  public visible: boolean = true;

  /**
   * The runtime type of the value. This might change if the value is dynamic, a union ,etc
   */
  private runtimeType: TypeDefinition;

  constructor(props: IOutputProps) {
    this.type = props.type;
    this.value = props.value;
  }

  setNode(node: Node) {
    this.node = node;
  }

  set(value: any, type?: Type) {
    this.value = value;
    //Reset the dynamic value
    this._isDynamic = false;
  }

  clear() {
    this.dynamicValues.clear();
  }

  setDynamic(key: string, value: any, type: Type) {
    if (!this.dynamic) {
      throw new Error("Cannot set dynamic value on non-dynamic output");
    }

    this.dynamicValues.set(key, {
      value,
      type,
    });
    this._isDynamic = true;
  }

  getDynamics() {
    if (!this.dynamic) {
      throw new Error("Not a dynamic value");
    }
    return this.dynamicValues;
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
    this.graph.connect(this.node, this, target.node, target, key);
  }
}
