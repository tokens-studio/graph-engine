import { Input } from "./input.js";
import { Node } from "./node.js";
import { Port } from "./port.js";
import { GraphSchema } from "@/schemas/index.js";
import { action, makeObservable, observable } from "mobx";

export interface IOutputProps<T = any> {
  name: string;
  type: GraphSchema;
  value: T;
  visible: boolean;
  node: Node;
}

export interface ConnectionStatus {
  /**
   * Whether the connection is valid
   */
  valid: boolean;
}

export class Output<T = any> extends Port<T> {
  constructor(props: IOutputProps<T>) {
    super(props);
    makeObservable(this, {
      set: action,
    });
  }

  set(value: T, type?: GraphSchema) {
    this._value = value;
    this._dynamicType = type;
  }

  /**
   * Use a key to access dynamic values off the port
   * @param target
   * @param key
   */
  connect(target: Input, key: string = "") {
    const graph = this.node.getGraph();
    if (!graph) {
      return {
        valid: false,
      };
    }

    graph.connect(this.node, this, target.node, target);
  }
}
