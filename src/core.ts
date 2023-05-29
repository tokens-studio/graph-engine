/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLoader, NodeDefinition } from './types.js';
import { NodeTypes } from './types.js';
import graphlib from 'graphlib';
import isPromise from 'is-promise';
import type { Edge, Node } from 'reactflow';

const { Graph, alg } = graphlib;

export type FlowGraph = {
    nodes: Node[],
    edges: Edge[],
    state: Record<string, any>
}

export type MinimizedNode = {
    id: string,
    type: string,
    data: any
}

export type MinimizedEdge = {
    id: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
}

export type MinimizedFlowGraph = {
    nodes: MinimizedNode[],
    edges: MinimizedEdge[]
}

type Lookup = {
    [key: string]: NodeDefinition<any, any, any>
}

export const convertFlowGraphToGraphlib = (graph: FlowGraph | MinimizedFlowGraph): graphlib.Graph => {

    // Simulate if adding a node will cause a cycle 
    const g = new Graph({ multigraph: true })
    graph.nodes.forEach((node) => {
        g.setNode(node.id, node.type);
    });

    graph.edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target, edge.id, edge.sourceHandle);
    });
    return g;
}

type Terminals = {
    input?: MinimizedNode
    output?: MinimizedNode
}

const findTerminals = (graph: MinimizedFlowGraph): Terminals => {
    const terminals: Terminals = {
        input: undefined,
        output: undefined
    }

    graph.nodes.forEach(node => {

        switch (node.type) {
            case NodeTypes.INPUT:
                terminals.input = node;
                break;
            case NodeTypes.OUTPUT:
                terminals.output = node;
                break;
        }
    })
    return terminals
}

const flowGraphToNodeLookup = (graph: MinimizedFlowGraph): Record<string, MinimizedNode> => {
    return graph.nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
    }, {} as Record<string, MinimizedNode>)
}

const flowGraphToEdgeLookup = (graph: MinimizedFlowGraph): Record<string, MinimizedEdge> => {
    return graph.edges.reduce((acc, edge) => {
        acc[edge.id] = edge;
        return acc;
    }, {} as Record<string, MinimizedEdge>)
}



export const minimizeFlowGraph = (graph: FlowGraph): MinimizedFlowGraph => {
    const state = graph.state || {};

    const nodeLookup = {};

    const nodes = graph.nodes.map(x => {
        //This is all thats required to be stored. We don't care about the rest of the graph.

        nodeLookup[x.id] = true
        return {
            id: x.id,
            data: state[x.id] || {},
            type: x.type
        } as MinimizedNode
    })

    return {
        nodes,
        edges: graph.edges.reduce((acc, x) => {

            if (!nodeLookup[x.source] || !nodeLookup[x.target]) {
                console.warn('Edge is not connected to a node. Ignoring...', x);
                return acc;
            }

            acc.push({
                id: x.id,
                target: x.target,
                source: x.source,
                //We might remove these in the future
                sourceHandle: x.sourceHandle,
                targetHandle: x.targetHandle

            } as MinimizedEdge)

            return acc;


        }, [] as MinimizedEdge[])
    }
}

export const defaultMapOutput = (input, state, processed) => {
    return { output: processed };
}


export interface ExecuteOptions {
    graph: MinimizedFlowGraph,
    inputValues: Record<string, any>,
    nodes: NodeDefinition<any, any, any>[]
    /**
     * A function responsible for loading externally requested data. This can be used to source token sets, etc
     */
    externalLoader?: ExternalLoader
}

// Map inputs 
// Perform unboxing //TODO
// Validate inputs
// Process
// Map outputs
// Perform boxing //TODO

export const execute = async (opts: ExecuteOptions) => {


    const { graph, inputValues, nodes } = opts;


    //First convert to Graphlib compat
    const g = convertFlowGraphToGraphlib(graph);

    //Create the lookup 
    const lookup: Lookup = nodes.reduce((acc, node) => {
        acc[node.type] = node;
        return acc;
    }, {});

    const nodeLookup = flowGraphToNodeLookup(graph);
    const edgeLookup = flowGraphToEdgeLookup(graph);
    const terminals = findTerminals(graph);

    if (!terminals.input) {
        throw new Error('No input node found');
    }
    if (!terminals.output) {
        throw new Error('No output node found');
    }

    //Get the topological order 
    const topologic = alg.topsort(g);


    //This stores intermediate states during execution
    const stateTracker: {
        [id: string]: Record<string, any>
    } = Object.keys(nodeLookup).reduce((acc, key) => {
        acc[key] = {
            input: {},
            output: {}
        }
        return acc;
    }, {});

    for (let i = 0, c = topologic.length; i < c; i++) {


        const nodeId = topologic[i];
        const node = nodeLookup[nodeId] as MinimizedNode;

        // Might happen with graphs that have not cleaned up their edges to nowhere 
        if (!node) {
            continue;
        }

        //Attempt to find the node in the lookup
        const nodeType = lookup[node.type];



        if (!nodeType) {
            throw new Error(`No node type found for ${node.type}`);
        }

        if (node.type === NodeTypes.INPUT) {
            //This is the input node, so we need to set the input
            stateTracker[nodeId] = {
                input: inputValues,
            };
        }

        //Input to the node
        const { input } = stateTracker[nodeId];
        let mappedInput = input;

        if (nodeType.mapInput) {
            //Map the input to the node
            mappedInput = nodeType.mapInput(input, node.data);
        }
        //Validate the input
        if (nodeType.validateInputs) {
            try {
                nodeType.validateInputs(mappedInput, node.data);
            }
            catch (e) {
                //Todo add flow trace 
                throw new Error(`Validation failed for node ${nodeId} of type ${node.type} with error ${e}`);
            }
        }

        if (nodeType.external && !opts.externalLoader) {
            throw new Error(`Node ${nodeId} of type ${node.type} requires an external loader`);
        }

        let ephemeral = null;
        if (nodeType.external && opts.externalLoader) {

            const ephemeralRequest = nodeType.external(mappedInput, node.data);
            ephemeral = await exports.externalLoader({
                type: nodeType.type,
                id: nodeId,
                data: ephemeralRequest
            });
        }


        let output = nodeType.process(mappedInput, node.data, ephemeral);

        //Wait for it to fully resolve
        //@ts-ignore
        if (isPromise(output)) {
            output = await output;
        }


        const mapOutput = nodeType.mapOutput || defaultMapOutput;
        //Now map the output to named handles 
        //This should give us a lookup via the handle name to the output value
        output = mapOutput(mappedInput, node.data, output, ephemeral);
        //Store the output
        stateTracker[nodeId].output = output;

        //Lookup the outEdges
        //Propagate the output to the next nodes
        const outEdges = g.outEdges(nodeId) || [];
        outEdges.forEach((edge) => {

            const edgeID = g.edge(edge.v, edge.w, edge.name);
            //Retrieve the edge 
            const edgeData = edgeLookup[edgeID];
            if (!edgeData) {
                throw new Error(`No edge data found for ${edgeID}`);
            }

            //Retrieve the data from the output according to the sourcHandle
            const outputValue = output[edgeData.sourceHandle];
            const affectedNode = stateTracker[edge.w];
            //This would only happen if the graph we were given had an edge that was not connected to a node.
            //In this case we choose to ignore it 
            if (affectedNode) {
                affectedNode.input[edgeData.targetHandle] = outputValue;
            }

        });
    }

    return stateTracker[terminals.output.id].output;
}


