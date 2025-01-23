import {
	ControlFlowInput,
	ControlFlowTriggerFunction
} from '../controlflow/input.js';
import { ControlFlowOutput } from '../controlflow/output.js';
import { INodeDefinition, Node, TypeDefinition } from './node.js';

export interface IControlFlowNode<
	T extends Node & IControlFlowNode<T> = ControlFlowNode
> {
	controlflow: ControlFlow<T>;
}

export class ControlFlow<T extends Node & IControlFlowNode<T>> {
	node: T;
	constructor(node: T) {
		this.node = node;
	}

	dispose() {
		// @ts-ignore
		this.node = null;
	}

	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInput<T = unknown>(
		name: string,
		executor: ControlFlowTriggerFunction<T>,
		type?: TypeDefinition
	) {
		return this.node.addInput(
			name,
			new ControlFlowInput<T>({
				name,
				on: executor,
				...type,
				node: this.node
			})
		);
	}

	addOutput<T = unknown>(name: string, type?: TypeDefinition) {
		return this.node.addOutput(
			name,
			new ControlFlowOutput<T>({
				...type,
				name,
				node: this.node
			})
		);
	}

	/**
	 * Function to call when the graph has been started.
	 * This is only really necessary for nodes that need to do something when the graph is expected to be running continuously
	 */
	public onStart = () => {};
	public onStop = () => {};
	/**
	 * By default, the node will stop when the graph is paused
	 */
	public onPause = () => {
		this.onStop();
	};
	/**
	 * By default, the node will start when the graph is resumed
	 */
	public onResume = () => {
		this.onStart();
	};
}

/**
 * The dataflow node can be used to easily create dataflow based nodes by extending off of it and implementing the execute method
 */
export class ControlFlowNode
	extends Node
	implements IControlFlowNode<ControlFlowNode>
{
	controlflow: ControlFlow<ControlFlowNode> = new ControlFlow<ControlFlowNode>(
		this
	);
	constructor(props: INodeDefinition) {
		super(props);
	}
}
