import { Input } from "./input.js";
import { Output } from "./output.js";
import { v4 as uuid } from 'uuid';
import { Graph, IDeserializeOpts, SerializedNode, annotatedNodeRunning } from "@/index.js";
import { GraphSchema } from "@/schemas/index.js";
import getDefaults from "json-schema-defaults";
import { action, computed, makeObservable, observable } from "mobx";



export interface INodeDefinition {
  graph: Graph;
  id?: string;
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
  /**
   * Additional annotations to store on the input
   */
  annotations?: Record<string, any>;
}

export class Node {
  /**
   * Unique instance specific identifier
   */
  readonly id: string;
  public static readonly description?: string;
  public static readonly title?: string;
  public static readonly annotations: Record<string, any> = {};
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
  public annotations: Record<string, any> = {};

  public lastExecutedDuration = 0;

  private _graph: Graph;

  public error?: Error;

  constructor(props: INodeDefinition) {
    this.id = props.id || uuid();
    this._graph = props.graph;

    makeObservable(this, {
      inputs: observable,
      outputs: observable,
      error: observable,
      annotations: observable,
      addInput: action,
      isRunning: computed,
      run: action,
      execute: action,
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
    return (this.inputs[name] = new Input<T>({
      name,
      ...type,
      visible: Boolean(type.visible),
      value: getDefaults(type.type),
      node: this,
    }));
  }
  addOutput<T = any>(name: string, type: TypeDefinition) {
    this.outputs[name] = new Output<T>({
      name,
      ...type,
      type: type.type,
      visible: Boolean(type.visible),
      value: getDefaults(type.type),
      node: this,
    });
  }

  /**
   * Removes a named input from the node. This should only be used for dynamic inputs
   * @param name 
   */
  removeInput(name: string) {
    if (this._graph) {
      this._graph.inEdges(this.id, name).forEach((edge) => {
        if (edge.id) {
          return;
        }
        this._graph?.removeEdge(edge.id);
      });
    }
    delete this.inputs[name];

    if (this._graph) {
      //Ask to be recalculated
      this._graph?.update(this.id);
    }
  }

  /**
   * This is the place to add applicate specific logic to execute the node.
   * This can be used directly, but you should preferably never call this and instead execute from the graph which will control the lifecycle of the node
   * @override
   */
  execute(): Promise<void> | void { }

  /**
   * Runs the node. Internally this calls the execute method, but the run entrypoint allows for additional tracking and lifecycle management
   */
  async run() {
    this.annotations[annotatedNodeRunning] = true;
    const start = performance.now();
    try {
      await this.execute();
      this.error = undefined;
    } catch (err) {
      this.error = err as Error;
    }
    const end = performance.now();
    this.annotations[annotatedNodeRunning] = false;
    this.lastExecutedDuration = end - start;

    return {
      error: this.error,
      start,
      end,
    };
  }

  /**
   * Asks the controlling graph to load a resource.
   * This cannot be called if the node is not part of a graph
   * @param uri 
   * @param data 
   */
  async load(uri: string, data?: any) {
    this._graph?.loadResource(uri, this, data);
  }

  get isRunning() {
    return !!this.annotations[annotatedNodeRunning];
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
    const serialized = {
      id: this.id,
      type: this.nodeType(),
      inputs: Object.values(this.inputs).map((x) => x.serialize()),
    } as SerializedNode;
    if (Object.keys(this.annotations).length > 0) {
      serialized.annotations = this.annotations;
    }
    return serialized;
  }

  /**
   * How to deserialize the node
   * @param serialized
   * @returns
   */
  public static deserialize(opts: IDeserializeOpts): Node {
    const newNode = new this({
      id: opts.serialized.id,
      graph: opts.graph,
    });

    newNode.annotations = opts.serialized.annotations || {};

    //Set the values directly from the save values
    opts.serialized.inputs.forEach((input) => {
      //Attempt a lookup by  name
      const foundInput = newNode.inputs[input.name];

      if (!foundInput) {
        //We need to create the input, it might be dynamic so we need to create it
        newNode.inputs[input.name] = new Input({
          name: input.name,
          type: input.type,
          variadic: input.variadic,
          visible: input.visible,
          value: input.value,
          node: newNode,
          annotations: input.annotations,
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

  getAllInputs = <T = Record<string, any>>(): T => {
    return Object.fromEntries(
      Object.entries(this.inputs).map(([key, value]) => [key, value.value])
    ) as T;
  };

  /**
   * Handles cleanup for nodes with state.
   * Use the super method to clear the graph reference
   */
  clear = () => {
    //@ts-ignore This is forcing manual cleanup
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

  /**
   * Function to call when the graph has been started.
   * This is only really necessary for nodes that need to do something when the graph is expected to be running continuously
   */
  public onStart = () => { };
  public onStop = () => { };
  public onPause = () => { };
  public onResume = () => { };
  /**
   * Triggered when a message is received from the graph.
   * @param action 
   * @param data 
   */
  public onAction = (action: string, data: any) => { };

}

