import { INodeDefinition, Node, TypeDefinition } from './node.js';
import { Input } from '../dataflow/input.js';
import { NodeRun } from '@/types.js';
import { Output } from '../dataflow/output.js';
import { action, computed, makeObservable, observable } from 'mobx';
import { annotatedNodeRunning } from '@/annotations/index.js';
import getDefaults from 'json-schema-defaults-esm';

export interface IDataflowNode<
	T extends Node & IDataflowNode<T> = DataflowNode
> {
	dataflow: Dataflow<T>;
	execute(): Promise<void> | void;
}

export class Dataflow<T extends IDataflowNode> {
	node: T;
	public lastExecutedDuration = 0;
	public error: Error | null = null;

	constructor(node: T) {
		this.node = node;

		makeObservable(this, {
			error: observable.ref,
			isRunning: computed,
			run: action,
			execute: action
		});
	}

	dispose() {
		//@ts-ignore This is forcing manual cleanup
		this.node = null;
	}

	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInput<T = DataflowNode>(name: string, type: TypeDefinition) {
		return this.node.addInputPort(
			name,
			new Input<T>({
				name,
				...type,
				value: getDefaults(type.type) as T,
				node: this.node
			})
		);
	}

	addOutput<T = unknown>(name: string, type: TypeDefinition) {
		this.node.addOutputPort(
			name,
			new Output<T>({
				name,
				...type,
				type: type.type,
				value: getDefaults(type.type) as T,
				node: this.node
			})
		);
	}

	/**
	 * This is the place to add applicate specific logic to execute the node.
	 * This can be used directly, but you should preferably never call this and instead execute from the graph which will control the lifecycle of the node
	 * @override
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute(): Promise<void> | void {
		return this.node.execute();
	}
	/**
	 * Runs the node. Internally this calls the execute method, but the run entrypoint allows for additional tracking and lifecycle management
	 */
	async run(): Promise<NodeRun> {
		this.node.setAnnotation(annotatedNodeRunning, true);
		const start = performance.now();
		const graph = this.node.getGraph();
		graph?.emit('nodeStarted', {
			node: this.node,
			start
		});
		try {
			await this.execute();
			this.error = null;
		} catch (err) {
			graph.logger.error(err);
			this.error = err as Error;
		}
		const end = performance.now();
		delete this.node.annotations[annotatedNodeRunning];
		this.lastExecutedDuration = end - start;

		const result = {
			node: this.node,
			error: this.error,
			start,
			end
		};

		graph?.emit('nodeExecuted', result);

		return result;
	}

	get isRunning() {
		return !!this.node.annotations[annotatedNodeRunning];
	}
}

/**
 * The dataflow node can be used to easily create dataflow based nodes by extending off of it and implementing the execute method
 */
export class DataflowNode extends Node implements IDataflowNode<DataflowNode> {
	dataflow: Dataflow<DataflowNode> = new Dataflow<DataflowNode>(this);
	constructor(props: INodeDefinition) {
		super(props);
	}

	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInput(name: string, type: TypeDefinition) {
		return this.addInput(name, type);
	}

	addOutput(name: string, type: TypeDefinition) {
		return this.dataflow.addOutput(name, type);
	}
	execute() {}
}
