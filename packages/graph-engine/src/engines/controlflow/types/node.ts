import { ControlFlowGraph } from '../index.js';
import {
	ControlFlowInput,
	ControlFlowTriggerFunction
} from './input.js';
import { ControlFlowOutput } from './output.js';
import { Node, TypeDefinition } from '../../../programmatic/node.js';


/**
 * The dataflow node can be used to easily create dataflow based nodes by extending off of it and implementing the execute method
 */
export class ControlFlowNode
	extends Node<ControlFlowGraph> {


	/**
	 * Creates a new input and adds it to the node
	 * @param name
	 * @param input
	 */
	addInput<T = unknown>(
		name: string,
		executor: ControlFlowTriggerFunction<T>,
		type?: TypeDefinition
	): ControlFlowInput<T> {

		return this.inputs[name] = new ControlFlowInput<T>({
			name,
			on: executor,
			...type,
			node: this
		})
	}

	addOutput<T = unknown>(name: string, type?: TypeDefinition) {
		return this.outputs[name] =
			new ControlFlowOutput<T>({
				...type,
				name,
				node: this
			})
	}

}
