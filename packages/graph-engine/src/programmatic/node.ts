import { Input } from "./input.js";
import { Output } from "./output.js";
import pkg from "uuid";
import { Graph, SerializedNode } from "@/index.js";
import { GraphSchema } from "@/schemas/index.js";
import getDefaults from "json-schema-defaults";
import { action, computed, makeObservable, observable } from "mobx";

const { v4: uuid } = pkg;

export interface INodeDefinition {
  id: string;
  inputs?: Record<string, Input>;
  outputs?: Record<string, Output>;
}

export interface TypeDefinition {
  type: GraphSchema;
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
  public static readonly title?: string;
  /**
   * The groups this node belongs to as a string array
   */
  static groups?: string[];
  static readonly type: string = "unknown";

  /**
   * This holds the definitions of the inputs and outputs
   */
  public inputs: Record<string, Input> = {};
  public outputs: Record<string, Output> = {};

  private _graph?: Graph;
  private _isRunning: boolean = false;

  constructor(props?: INodeDefinition) {
    this.id = props?.id || uuid();

    makeObservable(this, {
      inputs: observable,
      outputs: observable,
      addInput: action,
      isRunning: computed,
      run: action,
      addOutput: action,
      clearOutputs: action,
    });
    //Defined nodes would be specified here
  }

  /**
   * Creates a new input and adds it to the node
   * @param name
   * @param input
   */
  addInput<T = any>(name: string, type: TypeDefinition) {
    //Extract the default value from the schema
    const value = getDefaults(type.type);
    this.inputs[name] = new Input<T>({
      name,
      type,
      value,
      node: this,
    });
  }
  addOutput<T = any>(name: string, type: TypeDefinition) {
    this.outputs[name] = new Output<T>({
      name,
      type,
      node: this,
    });
  }

  /**
   * This is the place to add applicate specific logic to execute the node.
   * This can be used directly, but you should preferably never call this and instead execute from the graph which will control the lifecycle of the node
   * @override
   */
  execute(): Promise<void> | void {}

  /**
   * Runs the node. Internally this calls the execute method, but the run entrypoint allows for additional tracking and lifecycle management
   */
  async run() {
    this._isRunning = true;
    const start = performance.now();
    await this.execute();
    const end = performance.now();
    this._isRunning = false;

    return {
      executionTime: end - start,
    };
  }

  get isRunning() {
    return this._isRunning;
  }

  /**
   * Clears all the outputs
   */
  clearOutputs() {
    this.outputs = {};
  }

  public setGraph(graph: Graph) {
    this._graph = graph;
  }

  public getGraph() {
    return this._graph;
  }

  /**
   * Get the type of the nodes
   * @returns
   */
  public nodeType = () => {
    //@ts-ignore
    return this.constructor.type;
  };
  /**
   * Returns the underlying class of the node. Useful for getting class specific properties
   * @returns
   */
  get factory(): typeof Node {
    //@ts-ignore
    return this.constructor;
  }

  /**
   * Serializes the node value for storage
   * @returns
   */
  public serialize(): SerializedNode {
    return {
      id: this.id,
      type: this.nodeType(),
      inputs: Object.values(this.inputs)
        .filter((value) => !value.isConnected())
        .map((x) => x.serialize()),
    };
  }

  /**
   * How to deserialize the node
   * @param serialized
   * @returns
   */
  public static deserialize(serialized: SerializedNode): Node {
    const newNode = new this({
      id: serialized.id,
    });

    //Set the values directly from the save values
    serialized.inputs.forEach((input) => {
      //Attempt a lookup by  name
      const foundInput = newNode.inputs[input.name];

      if (!foundInput) {
        //We need to create the input, it might be dynamic so we need to create it
        newNode.inputs[input.name] = new Input({
          name: input.name,
          type: input.type,
          value: input.value,
          node: newNode,
        });
      } else {
        //Set the value from the saved value
        foundInput.deserialize(input);
      }
    });

    return newNode;
  }

  public static getType = () => {
    return this.type;
  };

  protected getAllInputs = () => {
    return Object.fromEntries(
      Object.entries(this.inputs).map(([key, value]) => [key, value.value])
    );
  };

  /**
   * Handles cleanup for nodes with state.
   * Use the super method to clear the graph reference
   */
  clear = () => {
    this._graph = undefined;
  };

  /**
   * Set the output of the node
   * @param name
   * @param value
   * @param type
   */

  protected setOutput = (name: string, value: any, type?: GraphSchema) => {
    //Check for existence if the outputs are dynamic
    if (!this.outputs[name]) {
      return;
    }
    this.outputs[name].set(value, type);
  };

  protected getInput = (name: string) => {
    return this.inputs[name].value;
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
      Object.entries(this.outputs).map(([key, value]) => [key, value.value()])
    );
  }
}

export interface NodeFactory {
  deserialize(serialized: SerializedNode): Node;
}
