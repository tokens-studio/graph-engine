import { Input } from "../input/index.js";
import { Output } from "../output/index.js";
import Ajv from "ajv";
import pkg from "uuid";
import { Graph, NodeTypes, SerializedNode } from "@/index.js";
import type { AnySchema as AjvSchema } from "ajv";
import { AnySchema, NumberArraySchema, NumberSchema } from "@/schemas/index.js";
const { v4: uuid } = pkg;

export interface INodeDefinition {
  id: string;
  inputs?: Record<string, Input>;
  outputs?: Record<string, Output>;
}

export interface TypeDefinition {
  type: AjvSchema;
  /**
   * When exposing an array of inputs or outputs, allow specific control for connecting each item
   */
  variadic?: boolean;
  /**
   * Whether the input is visible by default in the UI
   */
  visible?: boolean;
}

export class Node {
  /**
   * Unique instance specific identifier
   */
  readonly id: string;
  public static readonly description?: string;
  readonly type: string;

  /**
   * This holds the definitions of the inputs and outputs
   */
  protected _inputs: Record<string, TypeDefinition> = {};
  protected _outputs: Record<string, TypeDefinition> = {};

  /**
   * This holds the actual values of the inputs and outputs
   */
  protected inputs: Record<string, Input> = {};
  protected outputs: Record<string, Output> = {};

  private _graph: Graph;

  constructor(props: INodeDefinition) {
    this.id = props.id || uuid();
    //Defined nodes would be specified here
  }

  /**
   * Creates a new input and adds it to the node
   * @param name
   * @param input
   */
  addInput(name: string, input: TypeDefinition) {
    this._inputs[name] = input;

    //@ts-expect-error This is incorrect and it is constructable
    const ajv = new Ajv({ useDefaults: true });
    //Create an input port
    this.inputs[name] = new Input({
      name,
      type: input,
      node: this,
      graph: this._graph,
    });
  }
  addOutput(name: string, output: TypeDefinition) {
    this._outputs[name] = output;
  }

  execute(): Promise<void> | void {
    this.outputs.value.set(this.inputs.value.get());

    return null;
  }

  public setGraph(graph: Graph) {
    this._graph = graph;
  }

  /**
   * Serializes the node value for storage
   * @returns
   */
  public serialize(): SerializedNode {
    return {
      v: 1,
      id: this.id,
      type: this.type,
      inputs: this.inputs,
    };
  }

  /**
   * How to deserialize the node
   * @param serialized
   * @returns
   */
  public static deserialize(serialized: SerializedNode): Node {
    return new this({
      id: serialized.id,
      inputs: Object.fromEntries(
        Object.entries(serialized.inputs).map(([key, value]) => [
          key,
          Input.deserialize(value),
        ])
      ),
    });
  }

  protected getAllInputs = () => {
    return Object.fromEntries(
      Object.entries(this.inputs).map(([key, value]) => [key, value.get()])
    );
  };

  /**
   * Set the output of the node
   * @param name
   * @param value
   * @param type
   */
  protected setOutput = (name: string, value: any, type?: AjvSchema) => {
    this.outputs[name].set(value);
    //Update the type if its dynamic
    if (type) {
      this.outputs[name].setDynamic(value, type);
    }
  };

  protected getInput = (name: string) => {
    return this.inputs[name].get();
  };
  protected getRawInput = (name: string) => {
    return this.inputs[name];
  };
  /**
   * Returns a JSON representation of the output values without calculating them
   * @returns
   */
  public getOutput() {
    return Object.fromEntries(
      Object.entries(this.outputs).map(([key, value]) => [key, value.value])
    );
  }
}

export interface NodeFactory {
  deserialize(serialized: SerializedNode): Node;
}





