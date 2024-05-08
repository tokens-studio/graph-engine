import { Graph, NodeFactory, Port, annotatedSingleton } from "@tokens-studio/graph-engine";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from 'uuid';

export interface IDuplicate {
    reactFlowInstance: ReactFlowInstance,
    graph: Graph,
    nodeLookup: Record<string, NodeFactory>,
}

/**
 * Note that we currently do not support duplicating nodes that don't exist in the graph, like groups
 * @returns 
 */
export const duplicateNodes = ({ graph, reactFlowInstance, nodeLookup }: IDuplicate) => (nodeIds: string[]) => {

    const { addNodes, addEdges } = nodeIds.reduce(
        (acc, nodeId) => {

            const node = reactFlowInstance.getNode(nodeId);
            //Ignore missing lookups
            if (!node) {
                return acc;
            }

            const graphNode = graph.getNode(nodeId);

            //Ignore missing nodes or attempts to duplicate singletons
            if (!graphNode || graphNode?.annotations[annotatedSingleton]) {
                return acc;
            }
            const newID = uuidv4();
            const saved = graphNode.serialize();

            const newGraphNode = graphNode?.factory.deserialize({
                serialized: {
                    ...saved,
                    id: newID,
                },
                graph,
                lookup: nodeLookup
            }
            );

            graph.addNode(newGraphNode);

            const newEdges = Object.entries(graphNode.inputs)
                .map(([key, value]) => {
                    // value._edges.
                    return (value as Port)._edges.map((edge) => {
                        const newEdgeId = uuidv4();

                        const vals = {
                            id: newEdgeId,
                            target: newID,
                            targetHandle: key,
                            source: edge.source,
                            sourceHandle: edge.sourceHandle,
                        };

                        graph.createEdge(vals);
                        return vals;
                    });
                })
                .flat();

            //De select the existing node so that we can select the new one
            node.selected = false;

            const newNodes = [{
                ...node,
                id: newID,
                selected: true,
                position: {
                    x: node.position.x + 20,
                    y: node.position.y + 100,
                },
            }];


            return {
                addNodes: acc.addNodes.concat(newNodes),
                addEdges: acc.addEdges.concat(newEdges),
            };
        },
        {
            addNodes: [] as Node[],
            addEdges: [] as Edge[],
        },
    );

    //We need to set the nodes and edges otherwise reactflow will not respect the change to the selected value we used
    reactFlowInstance.setNodes((existingNodes) => {
        return existingNodes.concat(addNodes);
    });
    reactFlowInstance.setEdges((existingEdges) => {
        return existingEdges.concat(addEdges);
    });
};
