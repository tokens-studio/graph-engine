import { Edge, Node, ReactFlowInstance } from 'reactflow';
import { FullyFeaturedGraph } from '@/types/index.js';
import {

  NodeFactory,
  Port,
  annotatedSingleton,
} from '@tokens-studio/graph-engine';
import { nanoid as uuid } from 'nanoid'
import { xpos, ypos } from '@/annotations/index.js';

export interface IDuplicate {
  reactFlowInstance: ReactFlowInstance;
  graph: FullyFeaturedGraph;
}

/**
 * Note that we currently do not support duplicating nodes that don't exist in the graph, like groups
 * @returns
 */
export const duplicateNodes =
  ({ graph, reactFlowInstance }: IDuplicate) =>
    (nodeIds: string[]) => {
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

          const clonedNode = graphNode.clone(graph);

          const newPosition = {
            x: node.position.x + 20,
            y: node.position.y + 100,
          };

          clonedNode.setAnnotation(xpos, newPosition.x);
          clonedNode.setAnnotation(ypos, newPosition.y);

          graph.addNode(clonedNode);

          const newEdges = Object.entries(graphNode.inputs)
            .map(([key, value]) => {
              // value._edges.
              return (value as Port)._edges.map((edge) => {
                const newEdgeId = uuid();

                const vals = {
                  id: newEdgeId,
                  target: clonedNode.id,
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

          const newNodes = [
            {
              ...node,
              id: clonedNode.id,
              selected: true,
              position: newPosition,
            },
          ];

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
