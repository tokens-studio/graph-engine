import { ControlFlowInput } from '@/programmatic/controlflow/input.js';
import { ControlFlowOutput } from '../../programmatic/controlflow/output.js';
import { DataFlowGraph } from '../dataflow/index.js';
import { GraphSchema } from '@/schemas/index.js';


export class ControlFlowGraph extends DataFlowGraph {

	ripple<T>(output: ControlFlowOutput, val: T, type?: GraphSchema) {
		//Get the edges
		const edges = output._edges;
		edges.forEach(edge => {
			const input = this.getNode(edge.target)?.inputs[edge.targetHandle];
			if (!input) {
				return;
			}
			(input as ControlFlowInput).trigger(val, type);
			this.emit('valueSent', edges);
		});
	}
}

