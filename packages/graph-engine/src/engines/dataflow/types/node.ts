import { INodeDefinition, Node, TypeDefinition } from '../../../programmatic/node.js';
import { Input, Output } from '../../../programmatic/index.js';
import { NodeRun } from '@/types.js';
import { action, computed, makeObservable, observable } from 'mobx';
import { annotatedNodeRunning } from '@/annotations/index.js';
import getDefaults from 'json-schema-defaults-esm';
import type { DataFlowGraph } from '../index.js';


export class DataflowNode extends Node<DataFlowGraph, Input, Output> {
	public lastExecutedDuration = 0;
	public error: Error | null = null;

	constructor(props: INodeDefinition<DataFlowGraph, Input, Output>) {

		super(props);
		makeObservable(this, {
			error: observable.ref,
			isRunning: computed,
			run: action,
			execute: action
		});
	}

	dispose() {
		//@ts-ignore This is to force release of the node reference
		this = null;
	}

	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInput<T = unknown>(name: string, type: TypeDefinition) {
		return this.addInput(
			name,
			new Input<T>({
				name,
				...type,
				value: getDefaults(type.type) as T,
				node: this
			})
		);
	}

	addOutput<T = unknown>(name: string, type: TypeDefinition) {
		this.addOutput(
			name,
			new Output<T>({
				name,
				...type,
				type: type.type,
				value: getDefaults(type.type) as T,
				node: this
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
		return this.execute();
	}
	/**
	 * Runs the node. Internally this calls the execute method, but the run entrypoint allows for additional tracking and lifecycle management
	 */
	async run(): Promise<NodeRun> {
		this.setAnnotation(annotatedNodeRunning, true);
		const start = performance.now();
		this.getGraph()?.emit('nodeStarted', {
			node: this,
			start
		});
		try {
			await this.execute();
			this.error = null;
		} catch (err) {
			this.getGraph()?.logger.error(err);
			this.error = err as Error;
		}
		const end = performance.now();
		delete this.annotations[annotatedNodeRunning];
		this.lastExecutedDuration = end - start;

		const result = {
			node: this,
			error: this.error,
			start,
			end
		};
		return result;
	}

	get isRunning() {
		return !!this.annotations[annotatedNodeRunning];
	}
}
