import { Edge, Graph, Node as GraphNode } from '@tokens-studio/graph-engine';
import { GROUP } from '@/ids.js';
import { GROUP_NODE_PADDING } from '@/constants.js';
import { Item, Menu, Separator } from 'react-contexify';
import { Node, getNodesBounds, useReactFlow, useStoreApi } from 'reactflow';
import { height, width, xpos, ypos } from '@/annotations/index.js';
import { useAction } from '@/editor/actions/provider.js';
import { useLocalGraph } from '@/hooks/index.js';
import { v4 as uuid } from 'uuid';
import React, { useCallback, useMemo } from 'react';

export type INodeContextMenuProps = {
  id: string;
  nodes: Node[];
};

export const SelectionContextMenu = ({ id, nodes }: INodeContextMenuProps) => {
  const reactFlowInstance = useReactFlow();
  const graph = useLocalGraph();
  const store = useStoreApi();
  const createNode = useAction('createNode');
  const duplicateNodes = useAction('duplicateNodes');

  const reactFlowNodes = reactFlowInstance.getNodes();

  // Note that we use a filter here to prevent getting nodes that have a parent node, ie are part of a group
  const selectedNodes = nodes.filter(
    (node) => node.selected && !node.parentId,
  );
  const selectedNodeIds = selectedNodes.map((node) => node.id);

  const onGroup = useCallback(() => {
    const bounds = getNodesBounds(nodes);
    const parentPosition = {
      x: bounds.x,
      y: bounds.y,
    };

    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });

    const newNodes = createNode({
      type: GROUP,
      position: parentPosition,
    });

    if (!newNodes) {
      return;
    }

    const { flowNode } = newNodes;

    reactFlowInstance.setNodes((nodes) => {
      // Note that group nodes should always occur before their children
      return [{
        ...flowNode,
        dragHandle: undefined,
        style: {
          width: bounds.width + GROUP_NODE_PADDING * 2,
          height: bounds.height + GROUP_NODE_PADDING * 2,
        },
        data: {
          expandable: true,
          expanded: true,
        }
      } as Node]
        .concat(nodes)
        .map((node) => {
          if (selectedNodeIds.includes(node.id)) {
            return {
              ...node,
              position: {
                x: node.position.x - parentPosition.x + GROUP_NODE_PADDING,
                y: node.position.y - parentPosition.y + GROUP_NODE_PADDING,
              },
              extent: 'parent' as const,
              parentId: flowNode.id,
            };
          }

          return node;
        });
    });

    const reactFlowNodesMap = new Map<string, Node>(
      reactFlowNodes.map((node) => [node.id, node]),
    );

    // Set annotations for all items in the group
    nodes.forEach((node) => {
      const graphNode = graph.getNode(node.id);
      if (graphNode) {
        graphNode.annotations[xpos] = node.position.x - parentPosition.x + GROUP_NODE_PADDING;
        graphNode.annotations[ypos] = node.position.y - parentPosition.y + GROUP_NODE_PADDING;
        graphNode.annotations[width] = reactFlowNodesMap.get(node.id)?.width || 200;
        graphNode.annotations[height] = reactFlowNodesMap.get(node.id)?.height || 100;
        graphNode.annotations['parentId'] = flowNode.id;
      }
    });

  }, [createNode, graph, nodes, reactFlowInstance, reactFlowNodes, selectedNodeIds, store]);

  const onCreateSubgraph = useCallback(() => {
    // Get all selected node ids, including children of groups
    const selectedNodeIds = selectedNodes
      .reduce((acc, node) => {
        if (node.type !== GROUP) {
          return [...acc, node.id];
        }

        const children = reactFlowNodes
          .filter((n) => n.parentId === node.id)
          .map((x) => x.id);

        if (children.length > 0) {
          return [...acc, node.id, ...children];
        }

        return acc;
      }, [] as string[]);
    const lookup = new Set(selectedNodeIds);

    //Lets create a new subgraph node

    //Get the position by finding the average of the selected nodes
    const position = selectedNodes.reduce(
      (acc, node) => {
        acc.x += node.position.x;
        acc.y += node.position.y;
        return acc;
      },
      { x: 0, y: 0 },
    );

    const finalPosition = {
      x: position.x / selectedNodes.length,
      y: position.y / selectedNodes.length,
    };

    const newNodes = createNode({
      type: 'studio.tokens.generic.subgraph',
      position: finalPosition,
    });

    //Request failed in some way
    if (!newNodes) {
      return;
    }

    const { graphNode, flowNode } = newNodes;

    //@ts-expect-error
    const internalGraph = graphNode._innerGraph as unknown as Graph;

    //Get the graph nodes from the existing graph
    const internalNodes = selectedNodeIds
      .map((id) => graph.getNode(id))
      .filter((x) => x);

    //Get the input node of the subgraph
    const existingInternal = Object.values(internalGraph.nodes);
    const inputNode = existingInternal.find(
      (x) => x.factory.type == 'studio.tokens.generic.input',
    );
    const outputNode = existingInternal.find(
      (x) => x.factory.type == 'studio.tokens.generic.output',
    );

    //Now we need to determine the inputs and outputs of the subgraph
    //We need to find the entry nodes and the exit nodes

    //The entry nodes are the nodes that have incoming edges that are not in the selection
    //The exit nodes are the nodes that have outgoing edges that are not in the selection

    const { exitEdges, internalEdges } = selectedNodeIds.reduce(
      (acc, x) => {
        const edges = graph.outEdges(x);
        //If there is an edge that is not in the selection then it is an entry node
        edges.forEach((edge) => {
          const isOutgoing = !lookup.has(edge.target);

          if (isOutgoing) {
            acc.exitEdges.push(edge);
          } else {
            acc.internalEdges.push(edge);
          }
        });
        return acc;
      },
      {
        exitEdges: [] as Edge[],
        internalEdges: [] as Edge[],
      },
    );

    const entryEdges = selectedNodeIds.reduce((acc, x) => {
      const edges = graph.inEdges(x);

      //If there is an edge that is not in the selection then it is an entry node
      const incomingEdges = edges.filter((edge) => {
        return !lookup.has(edge.source);
      });

      if (incomingEdges.length != 0) {
        acc = acc.concat(incomingEdges);
      }
      return acc;
    }, [] as Edge[]);

    //Add the nodes to the subgraph
    internalNodes.forEach((node) => {
      internalGraph.addNode(node!);
    });

    //We need to create a input  for each of the entry edges
    entryEdges.forEach((edge) => {
      //Get the output node of the edge
      const outputNode = graph.getNode(edge.target);
      const input = outputNode?.inputs[edge.targetHandle];

      //Its possible that we have a collision with the name so we need to rename it
      const initialName = edge.targetHandle;
      let name = initialName;
      let count = 0;

      while (inputNode?.inputs[name]) {
        name = initialName + '_' + count++;
      }

      inputNode?.addInput(name, {
        type: input!.type,
      });
      //The output won't be dynamically generated until the node is executed, so we add it manually
      inputNode?.addOutput(name, {
        type: input!.type,
      });

      //Then we need to restore the old edge and connect it to the new input
      const newEdge = graph.createEdge({
        id: uuid(),
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: graphNode.id,
        targetHandle: name,
      });

      //Create an edge in the internal graph from the input to the target
      internalGraph.createEdge({
        id: uuid(),
        source: inputNode!.id,
        sourceHandle: name,
        target: edge.target,
        targetHandle: edge.targetHandle,
      });

      //We also need to add a flow edge
      reactFlowInstance.addEdges([newEdge]);
    });

    exitEdges.forEach((edge) => {
      //Get the output node of the edge
      const sourceNode = graph.getNode(edge.source);
      const sourceOutput = sourceNode?.outputs[edge.sourceHandle];

      //Its possible that we have a collision with the name so we need to rename it
      const initialName = edge.targetHandle;
      let name = initialName;
      let count = 0;

      while (outputNode?.inputs[name]) {
        name = initialName + '_' + count++;
      }

      outputNode?.addInput(name, {
        type: sourceOutput!.type,
      });
      outputNode?.addOutput(name, {
        type: sourceOutput!.type,
      });

      //Ensure the output exists on the outer graph node as it will only be dynamically populated once the subgraph has run
      graphNode.addOutput(name, {
        type: sourceOutput!.type,
      });

      //Create an edge in the outer graph from the subgraph to the target
      const newEdge = graph.createEdge({
        id: uuid(),
        source: graphNode.id,
        sourceHandle: name,
        target: edge.target,
        targetHandle: edge.targetHandle,
      });

      //Create an edge in the internal graph
      internalGraph.createEdge({
        id: uuid(),
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: outputNode!.id,
        targetHandle: name,
      });

      //We also need to add a flow edge
      reactFlowInstance.addEdges([newEdge]);
    });

    //Reconnect the edges that are internal to the subgraph
    internalEdges.forEach((edge) => {
      //Create an edge in the internal graph
      //Do not trigger any updates
      internalGraph.createEdge({
        ...edge,
        noPropagate: true,
      });
    });

    // //Remove the selected nodes from the graph
    selectedNodeIds.forEach((id) => {
      graph.removeNode(id);
    });

    internalNodes.forEach((node) => {
      internalGraph.addNode(node!);
    });

    //Now filter out nodes that were in the original selection
    reactFlowInstance.setNodes((nodes) =>
      [...nodes.filter((x) => lookup.has(x.id) == false)].concat([flowNode]),
    );

    //We then need to find all the downstream nodes from those nodes for the output
  }, [createNode, graph, reactFlowInstance, selectedNodeIds, selectedNodes]);

  const onDuplicate = () => {
    duplicateNodes(selectedNodeIds);
  };

  const hasGroup = selectedNodes.some((node) => node.type === GROUP);

  return (
    <Menu id={id}>
      {!hasGroup && <Item onClick={onGroup}>Create group</Item>}
      <Item onClick={onCreateSubgraph}>Create Subgraph</Item>
      <Separator />
      <Item onClick={onDuplicate}>Duplicate</Item>
    </Menu>
  );
};
