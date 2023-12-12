import { Node } from "../node/index.js";
import { TypeDefinition } from "@/nodes/generic/input.js";

export interface IInputProps {
  name?: string;
  type: TypeDefinition;
  value?: any;
}

export class Input {
  /**
   * Name to show in the side panel.Optional
   * */
  public name?: string;
  /** Type */
  public type: TypeDefinition;
  public value: any;
  /**
   * The parent node of this input
   */
  public node: Node;

  constructor(props: IInputProps) {
    this.name = props.name;
    this.type = props.type;
    this.value = props.value;
  }

  setNode(node: Node) {
    this.node = node;
  }
  get(): any {
    return this.value;
  }

  serialize() {
    return {
      name: this.name,
      value: this.value,
    };
  }
}
