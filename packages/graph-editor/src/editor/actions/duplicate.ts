import { useLocalGraph } from "@/hooks";
import { Port } from "@tokens-studio/graph-engine";
import {  Node,Edge, useReactFlow } from "reactflow";
import { v4 as uuidv4 } from 'uuid';

export const onDuplicate = (lookup)=> () => {

    const graph = useLocalGraph();
    const reactFlowInstance = useReactFlow();
    const nodes = reactFlowInstance.getNodes().filter((x) => x.selected);
    const { addNodes, addEdges } = nodes.reduce(
        (acc, node) => {
            const graphNode = graph.getNode(node.id);

            if (!graphNode) {
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
                lookup
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
            const existing = reactFlowInstance.getNodes().map((x) => {
                if (x.id === node.id) {
                    return {
                        ...x,
                        selected: false,
                    };
                }
                return x
            });
            node.selected = false;

            const newNodes = existing.concat(
                nodes.map((node) => {
                    node.id;
                    return {
                        ...node,
                        id: newID,
                        selected: true,
                        position: {
                            x: node.position.x + 20,
                            y: node.position.y + 100,
                        },
                    };
                }),
            );

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
    reactFlowInstance.setNodes(addNodes);
    reactFlowInstance.setEdges(addEdges);
};
