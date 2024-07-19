import { Edge, Node, ReactFlowInstance } from 'reactflow';
import { GROUP } from '@/ids.js';
import {
  Graph,
  NodeFactory,
  Port,
  annotatedSingleton,
} from '@tokens-studio/graph-engine';
import { parentId } from '@/annotations/index.js';
import { v4 as uuidv4 } from 'uuid';

export interface IDuplicate {
  reactFlowInstance: ReactFlowInstance;
  graph: Graph;
  nodeLookup: Record<string, NodeFactory>;
}

/**
 * Note that we currently do not support duplicating nodes that don't exist in the graph, like groups
 * @returns
 */
export const duplicateNodes =
  ({ graph, reactFlowInstance }: IDuplicate) =>
  (nodeIds: string[]) => {
    nodeIds = nodeIds.reduce((acc, nodeId) => {
      const node = reactFlowInstance.getNode(nodeId);
      if (node?.type == GROUP) {
        const children = reactFlowInstance.getNodes()
          .filter((x) => x.parentId === nodeId)
          .map((x) => x.id);
        return [...acc, nodeId, ...children];
      }

      return [...acc, nodeId];
    }, [] as string[]);

		const oldToNewIdMap = new Map<string, string>();
    
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
        oldToNewIdMap.set(nodeId, clonedNode.id);

        const newPosition = {
          x: node.position.x + 20,
          y: node.position.y + 100,
        };

        clonedNode.annotations['ui.position.x'] = newPosition.x;
        clonedNode.annotations['ui.position.y'] = newPosition.y;

        // Set new parentId annotation if it exists
        if (node.parentId && oldToNewIdMap.get(node.parentId)) {
          clonedNode.annotations[parentId] = oldToNewIdMap.get(node.parentId);
        }

        graph.addNode(clonedNode);

        const newEdges = Object.entries(graphNode.inputs)
          .map(([key, value]) => {
            // value._edges.
            return (value as Port)._edges.map((edge) => {
              const newEdgeId = uuidv4();

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
            parentId: node.parentId ? oldToNewIdMap.get(node.parentId) : undefined,
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
