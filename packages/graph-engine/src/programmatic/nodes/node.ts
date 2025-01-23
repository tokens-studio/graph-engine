import { Annotated } from '../annotated.js';
import { DATAFLOW_PORT, DataFlowPort } from '../dataflow/base.js';
import { Graph } from '../../graph/index.js';
import { GraphSchema } from '../../schemas/index.js';
import { IDeserializeOpts, SerializedNode } from '../../graph/types.js';
import { Input } from '../dataflow/input.js';
import { Output } from '../dataflow/output.js';
import { Port } from '../port.js';
import { action, makeObservable, observable } from 'mobx';
import { nanoid as uuid } from 'nanoid';

export interface INodeDefinition {
	graph: Graph;
	id?: string;
	inputs?: Record<string, Input>;
	outputs?: Record<string, Output>;
	annotations?: Record<string, unknown>;
}

// Helper type to preserve literal types
type Prettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type InputValue<T> = T extends Input<infer U> ? U : never;
// Updated UnwrapInput type
type UnwrapInput<T> = Prettify<{
	[K in keyof T]: InputValue<T[K]>;
}>;

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
	annotations?: Record<string, unknown>;
}

export class Node extends Annotated {
	/**
	 * Unique instance specific identifier
	 */
	readonly id: string;
	public static readonly description?: string;
	public static readonly title?: string;
	static readonly type: string = 'unknown';

	/**
	 * This holds the definitions of the inputs and outputs
	 */
	public inputs: Record<string, Port> = {};
	public outputs: Record<string, Port> = {};

	private _graph: Graph;

	constructor(props: INodeDefinition) {
		super(props);
		this.id = props.id || uuid();
		this._graph = props.graph;
		if (this._graph) {
			this._graph.addNode(this);
		}

		makeObservable(this, {
			inputs: observable.shallow,
			outputs: observable.shallow,
			addInputPort: action,
			addOutputPort: action,
			removeInputPort: action,
			removeOutputPort: action
		});
		//Defined nodes would be specified here
	}

	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInputPort(name: string, port: Port) {
		this.inputs[name] = port;
	}
	addOutputPort(name: string, port: Port) {
		this.outputs[name] = port;
	}
	/**
	 * Removes a named input from the node. This should only be used for dynamic inputs
	 * @param name
	 */
	removeInputPort(name: string) {
		if (this._graph) {
			this._graph.inEdges(this.id, name).forEach(edge => {
				if (edge.id) {
					return;
				}
				this._graph?.removeEdge(edge.id);
			});
		}
		delete this.inputs[name];
	}

	removeOutputPort(name: string) {
		if (this._graph) {
			this._graph.outEdges(this.id, name).forEach(edge => {
				if (edge.id) {
					return;
				}
				this._graph?.removeEdge(edge.id);
			});
		}
		delete this.outputs[name];
	}

	public setGraph(graph: Graph) {
		this._graph = graph;
	}

	public getGraph() {
		return this._graph;
	}

	public clone(newGraph: Graph): Node {
		// Create a new instance using the constructor
		const clonedNode = new this.factory({
			graph: newGraph,
			id: uuid()
		});

		// Copy input values
		Object.entries(this.inputs).forEach(([key, input]) => {
			//TODO remove this. The dataflow cloning needs to be handled by the dataflow itself
			if (input.variadic) return;
			const targetInput = clonedNode.inputs[key] as Input;
			if (targetInput && targetInput.pType === DATAFLOW_PORT) {
				targetInput.setValue((input as DataFlowPort).value);
				//Try handle dynamic inputs
			} else {
				clonedNode.inputs[key] = input.clone();
			}
		});

		Object.entries(this.outputs).forEach(([key, output]) => {
			clonedNode.outputs[key] = output.clone();
		});

		clonedNode.annotations = { ...this.annotations };

		// Clone inner graph if it exists
		// @ts-expect-error
		if (this._innerGraph) {
			// @ts-expect-error
			clonedNode._innerGraph = this._innerGraph.clone();
		}

		return clonedNode;
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
			//Filter out any inputs that are connected as they will be serialized as part of the edge
			inputs: Object.values(this.inputs)
				.map(x => (x as Input).serialize?.())
				.filter(x => !!x)
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
	public static async deserialize(opts: IDeserializeOpts): Promise<Node> {
		const newNode = new this({
			id: opts.serialized.id,
			...opts
		});

		newNode.annotations = opts.serialized.annotations || {};

		//Set the values directly from the save values
		opts.serialized.inputs.forEach(input => {
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
					annotations: input.annotations
				});
			} else {
				//Set the value from the saved value
				(foundInput as Input).deserialize?.(input);
			}
		});

		return newNode;
	}

	public static getType = () => {
		return this.type;
	};

	getAllInputs = (): UnwrapInput<this['inputs']> => {
		return Object.fromEntries(
			Object.entries(this.inputs as Record<string, Input>).map(
				([key, value]) => [key, value.value]
			)
		) as UnwrapInput<this['inputs']>;
	};

	/**
	 * Handles cleanup for nodes with state.
	 * Use the super method to clear the graph reference
	 *
	 * @example
	 * ```typescript
	 * class MyNode extends Node {
	 *  dispose() {
	 *
	 *   Node.prototype.dispose.call(this);
	 *   // or if you have full ES6 support
	 *   super.dispose();
	 *
	 *  //Some additional manual cleanup
	 *  // ...
	 * }
	 */
	dispose = () => {
		//@ts-ignore This is forcing manual cleanup
		this._graph = undefined;
	};
}
