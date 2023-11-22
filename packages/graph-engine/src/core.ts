import { ExternalLoader, NodeDefinition } from "./types.js";
import {
  MinimizedFlowGraph,
  MinimizedNode,
  findTerminals,
  topologicalSort,
} from "./graph/index.js";
import { NodeTypes } from "./types.js";
import isPromise from "is-promise";
import cmp from "semver-compare";
import { VERSION } from "./constants.js";



type Lookup = {
  [key: string]: NodeDefinition<any, any, any>;
};

const flowGraphToNodeLookup = (
  graph: MinimizedFlowGraph
): Record<string, MinimizedNode> => {
  return graph.nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {} as Record<string, MinimizedNode>);
};

export const defaultMapOutput = (input, state, processed) => {
  return { output: processed };
};

export interface ExecuteOptions {
  graph: MinimizedFlowGraph;
  inputValues: Record<string, any>;
  nodes: NodeDefinition<any, any, any>[];
  /**
   * A function responsible for loading externally requested data. This can be used to source token sets, etc
   */
  externalLoader?: ExternalLoader;
  /**
   * If true, no warnings will be logged
   */
  quiet?: boolean;
}

export interface NodeExecutionOptions {
  nodeId: string;
  node: NodeDefinition<any, any, any>;
  input: any;
  state: Record<string, any>;
  externalLoader?: ExternalLoader;
}

export const executeNode = async (opts: NodeExecutionOptions) => {
  const { input, node, nodeId, state, externalLoader } = opts;

  let mappedInput = input;
  if (node.mapInput) {
    //Map the input to the node
    mappedInput = node.mapInput(input, state);
  }
  //Validate the input
  if (node.validateInputs) {
    try {
      node.validateInputs(mappedInput, state);
    } catch (e) {
      //Todo add flow trace
      throw new Error(
        `Validation failed for node "${nodeId}" of type "${node.type}" with error "${e}"`
      );
    }
  }

  if (node.external && !externalLoader) {
    throw new Error(
      `Node "${nodeId}" of type "${node.type}" requires an external loader`
    );
  }

  let ephemeral = {};
  if (node.external && externalLoader) {
    const ephemeralRequest = node.external(mappedInput, state);
    ephemeral = await externalLoader({
      type: node.type,
      id: nodeId,
      data: ephemeralRequest,
    });
  }

  let output = node.process(mappedInput, state, ephemeral);

  //Wait for it to fully resolve
  //@ts-ignore
  if (isPromise(output)) {
    output = await output;
  }

  const mapOutput = node.mapOutput || defaultMapOutput;
  //Now map the output to named handles
  //This should give us a lookup via the handle name to the output value
  return mapOutput(mappedInput, state, output, ephemeral);
};

// Map inputs
// Perform unboxing //TODO
// Validate inputs
// Process
// Map outputs
// Perform boxing //TODO

export const execute = async (opts: ExecuteOptions) => {
  const { graph, inputValues, nodes, quiet } = opts;

  //Previously graphs didn't contain the version
  if (!quiet && cmp(graph.version || "0.0.0", VERSION) == -1) {
    console.warn(
      `Graph version is older than engine version. This might cause unexpected behaviour. Graph version: ${graph.version}, Engine version: ${VERSION}`
    );
  }
  const g = graph;

  //Create the lookup
  const lookup: Lookup = nodes.reduce((acc, node) => {
    acc[node.type] = node;
    return acc;
  }, {});

  const nodeLookup = flowGraphToNodeLookup(graph);
  const terminals = findTerminals(graph);

  if (!terminals.input) {
    throw new Error("No input node found");
  }
  if (!terminals.output) {
    throw new Error("No output node found");
  }

  //Get the topological order
  const topologic = topologicalSort(g);

  //This stores intermediate states during execution
  const stateTracker: {
    [id: string]: Record<string, any>;
  } = Object.keys(nodeLookup).reduce((acc, key) => {
    acc[key] = {
      input: {},
      output: {},
    };
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

    const output = await executeNode({
      nodeId,
      node: nodeType,
      input,
      state: node.data,
      externalLoader: opts.externalLoader,
    });

    //Store the output
    stateTracker[nodeId].output = output;

    //Lookup the outEdges
    //Propagate the output to the next nodes
    const outEdges = g.outEdges(nodeId) || [];
    outEdges.forEach((edge) => {
      //Retrieve the edge
      const edgeData = g.getEdge(edge.id);
      if (!edgeData) {
        throw new Error(`No edge data found for ${edge.id}`);
      }

      //Retrieve the data from the output according to the sourcHandle
      const outputValue = output[edgeData.sourceHandle];
      const affectedNode = stateTracker[edge.target];
      //This would only happen if the graph we were given had an edge that was not connected to a node.
      //In this case we choose to ignore it
      if (affectedNode) {
        affectedNode.input[edgeData.targetHandle] = outputValue;
      }
    });
  }

  return stateTracker[terminals.output.id].output;
};
