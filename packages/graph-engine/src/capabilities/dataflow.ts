import { CapabilityFactory } from './interface.js';
import { DATAFLOW_PORT } from '@/programmatic/dataflow/base.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { Graph, topologicalSort } from '../graph/index.js';
import { GraphSchema } from '@/schemas/index.js';
import { ISetValue, Output } from '@/programmatic/index.js';
import { Input } from '@/programmatic/dataflow/input.js';
import { annotatedVariadicIndex } from '@/annotations/index.js';
import { dedupe } from '../utils/dedupe.js';

export interface DataFlowCapability {
	/**
	 * Will forcefully update a node in the graph. This will also update all the edges that are connected to the node recursively
	 * @throws[Error] if the node is not found
	 * @param nodeID
	 */
	update(nodeID: string, opts?: IUpdateOpts): Promise<void>;
	/**
	 * Triggers the execution of the node and updates the successor nodes
	 * @param nodeId
	 * @param oneShot
	 * @returns
	 */
	propagate(nodeId: string, oneShot?: boolean): Promise<void>;
	/**
	 * Executes the graph as a single batch. This will execute all the nodes in the graph and return the output of the output node
	 * Note that this can have side effects and you should create a new instance of a graph between runs if you want to isolate the execution
	 * @param opts
	 * @throws {BatchRunError}
	 * @returns
	 */
	execute(opts?: GraphExecuteOptions): Promise<BatchExecution>;
}

export type InputDefinition = {
	value: any;
	type?: GraphSchema;
};

export type GraphExecuteOptions = {
	inputs?: Record<string, InputDefinition>;
	/**
	 * Whether to track and emit stats as part of the execution
	 */
	stats?: boolean;
	/**
	 * Whether to provide a journal of the execution
	 */
	journal?: boolean;
};

export interface StatRecord {
	start: number;
	end: number;
	error?: Error;
}

export interface IUpdateOpts {
	/**
	 * If true, no memoization will be performed
	 */
	noMemo?: boolean;
	/**
	 * If true, the update will not be propagated to the successor nodes
	 */
	noRecursive?: boolean;
	/**
	 * If true, we won't compare the input values to see if the node needs to be updated
	 */
	noCompare?: boolean;
}

export interface BatchExecution {
	start: number;
	end: number;
	stats?: Record<string, StatRecord>;
	order: string[];
	output?: {
		[key: string]: {
			value: any;
			type: GraphSchema;
		};
	};
}

export const DataFlowCapabilityFactory: CapabilityFactory = {
	name: 'dataFlow',
	register: (graph: Graph) => {
		const ctx = {
			async update(nodeID: string, opts?: IUpdateOpts) {
				const { noRecursive = false } = opts || {};

				const node = graph.nodes[nodeID];
				if (!node) {
					throw new Error(`No node found with id ${nodeID}`);
				}

				const res = await (node as DataflowNode).dataflow?.run();
				//Don't propagate if there is an error
				if (res.error) {
					return;
				}

				if (noRecursive) {
					return;
				}

				await ctx.propagate(node.id);
			},

			async propagate(nodeId: string, oneShot: boolean = false) {
				const node = graph.getNode(nodeId);
				if (!node) {
					return;
				}
				//Update all the outgoing edges
				const outEdges = graph.outEdges(node.id);
				/**
				 * This is a heuristic to not attempt to update nodes that don't have a detected port at the end-
				 */
				const affectedNodes = outEdges
					.map(edge => {
						const output = node.outputs[edge.sourceHandle] as Output;

						//It might be dynamic
						if (!output || output.pType !== DATAFLOW_PORT) {
							return;
						}
						const value = output.value;
						//write the value to the input port of the target
						const target = graph.getNode(edge.target);
						if (!target) {
							return;
						}
						const input = target.inputs[edge.targetHandle] as Input;
						if (!input) {
							return;
						}

						if (input.variadic) {
							//Don't attempt mutation of the original array
							const newVal = [...(input.value || [])];
							newVal[edge.annotations[annotatedVariadicIndex]!] = output.value;
							//Extend the variadic array
							input.setValue(newVal, {
								//We are controlling propagation
								noPropagate: true
							});
						} else {
							input.setValue(value, {
								type: output.type,
								//We are controlling propagation
								noPropagate: true
							});
						}

						return edge.target;
					})
					//Remove holes
					.filter(Boolean) as string[];

				if (!oneShot) {
					//These are the nodes to be update
					const nodes = dedupe(affectedNodes);
					await Promise.all(nodes.map(x => ctx.update(x)));
				}
			},

			async execute(opts?: GraphExecuteOptions): Promise<BatchExecution> {
				const { inputs, stats } = opts || {};

				const start = performance.now();
				const statsTracker = {};

				if (inputs) {
					const input = Object.values(graph.nodes).find(
						x => x.factory.type === 'studio.tokens.generic.input'
					);
					if (!input) {
						throw new Error('No input node found');
					}

					//Set the inputs for execution
					Object.entries(inputs).forEach(([key, value]) => {
						const opts: ISetValue = {
							//We are controlling propagation
							noPropagate: true
						};
						//Only necessary if there is dynamic typing involved
						if (value.type) {
							opts.type = value.type;
						}
						const port = input.inputs[key] as Input;

						if (port && port.pType == DATAFLOW_PORT) {
							port.setValue(value.value, opts);
						}

						//Its possible that there is no input with the name
					});
				}

				//Perform a topological sort

				const topologic = topologicalSort(graph);
				//This stores intermediate states during execution
				for (let i = 0, c = topologic.length; i < c; i++) {
					const nodeId = topologic[i];

					const node = graph.getNode(nodeId);

					// Might happen with graphs that have not cleaned up their edges to nowhere
					if (!node) {
						continue;
					}
					//Execute the node
					const res = await (node as DataflowNode).dataflow?.run();
					if (res.error) {
						//@ts-ignore
						(res.error as BatchRunError).nodeId = nodeId;
						throw res.error;
					}

					if (stats) {
						statsTracker[nodeId] = res;
					}

					//Propagate the values. No need to wait as it is a oneshot
					ctx.propagate(nodeId, true);
				}

				let output: BatchExecution['output'] = undefined;

				//Get the output node
				const outputNode = Object.values(graph.nodes).find(
					x => x.factory.type === 'studio.tokens.generic.output'
				);

				if (outputNode) {
					//Output has a dynamic amount of ports, so emit a single object with each of them
					output = Object.fromEntries(

						Object.entries(outputNode.inputs)
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							.filter(([_, v]) => v.pType == DATAFLOW_PORT)
							.map(([key, value]: [string, Output]) => {
								return [
									key,
									{
										value: value.value,
										type: value.type
									}
								];
							})
					);
				}

				const end = performance.now();
				return {
					order: topologic,
					stats: statsTracker,
					start,
					end,
					output
				};
			}
		} as DataFlowCapability;

		graph.on('edgeRemoved', edge => {
			//Try get the node
			const target = graph.getNode(edge.target);

			//No sidefffects when not a dataflow node
			if (!(target as DataflowNode).dataflow) {
				return;
			}

			const input = target.inputs[edge.targetHandle] as Input;
			const index = edge.annotations[annotatedVariadicIndex]!;

			//We need to check if its pointing to a variadic input and compact it if needed
			if (input.variadic) {
				//Remove the index
				const newVal = [...(input.value || [])];
				newVal.splice(index, 1);
				input.setValue(newVal, {
					noPropagate: true
				});
			}

			//Check if we should recompute the node
			if ((target as DataflowNode)?.dataflow) {
				ctx.update(target.id);
			}
		});

		graph.onFinalize('edgeAdded', edge => {
			const targetNode = graph.getNode(edge.target);
			//No sidefffects when not a dataflow node
			if ((targetNode as DataflowNode).dataflow) {
				const sourceNode = graph.getNode(edge.source);
				const targetPort = targetNode.inputs[edge.targetHandle] as Input;
				const sourcePort = sourceNode.outputs[edge.sourceHandle] as Output;
				if (targetPort.variadic) {
					//Extend the variadic array
					targetPort.setValue(
						(targetPort.value || []).concat([sourcePort.value]),
						{
							//TODO
							// Note that this is a quick fix and that we should probably restrict the update of the typing so that it cannot be overriden later
							type: {
								type: 'array',
								items: sourcePort.type
							}
						}
					);
				}
				ctx.propagate(edge.source);
			}
			return edge;
		});
		return ctx;
	}
};

export type WithDataFlow = {
	dataFlow: DataFlowCapability;
};
