import { Graph } from 'graphlib';
import { Item, Menu, Separator } from 'react-contexify';
import { Node, ReactFlowInstance, useReactFlow } from 'reactflow';
import { useAction } from '@/editor/actions/provider.js';
import { useCanDeleteNode } from '@/hooks/useCanDeleteNode.js';
import { useLocalGraph } from '@/hooks/index.js';
import { useToast } from '@/hooks/useToast.js';
import React, { useCallback } from 'react';
import clsx from 'clsx';

export interface INodeContextMenuProps {
  id: string;
  nodes: Node[];
}

const convertToGraph = (flow: ReactFlowInstance) => {
  const nodes = flow.getNodes();
  const edges = flow.getEdges();

  const graph = new Graph({ multigraph: true });
  nodes.forEach((node) => graph.setNode(node.id));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  return graph;
};

const findAllUpstream = (id: string, graph: Graph) => {
  return (graph.predecessors(id) || []).flatMap((x) =>
    [x].concat(findAllUpstream(x, graph)),
  );
};

const findAllDownstream = (id: string, graph: Graph) => {
  return (graph.successors(id) || []).flatMap((x) =>
    [x].concat(findAllDownstream(x, graph)),
  );
};

const createNodeLookup = (nodes: string[]) => {
  return nodes.reduce(
    (acc, node) => {
      acc[node] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
};

const applyFilters = (
  flow: ReactFlowInstance,
  lookup: Record<string, boolean>,
) => {
  flow.setNodes((nodes) =>
    nodes.map((x) => {
      if (!lookup[x.id]) {
        return {
          ...x,
          className: clsx(x.className, 'filtered'),
        };
      }
      return {
        ...x,
        className: clsx(x.className, {
          filtered: false,
        }),
      };
    }),
  );
};

export const NodeContextMenu = ({ id, nodes }: INodeContextMenuProps) => {
  const trigger = useToast();
  const reactFlowInstance = useReactFlow();
  const duplicateNodes = useAction('duplicateNodes');
  const graph = useLocalGraph();

  const isDeletable = useCanDeleteNode(nodes?.[0]?.id);

  const deleteEl = useCallback(() => {
    if (!isDeletable) {
      trigger({
        title: 'Node is not deletable',
        description: 'This node cannot be deleted',
      });
      return;
    }

    if (nodes) {
      reactFlowInstance.deleteElements({ nodes });
    }
  }, [isDeletable, nodes, reactFlowInstance, trigger]);

  const focus = useCallback(() => {
    if (nodes) {
      const focalCenter = nodes.reduce(
        (acc, node) => {
          return {
            x: acc.x + node.position.x + (node.width || 0) / 2,
            y: acc.y + node.position.y + (node.height || 0) / 2,
          };
        },
        { x: 0, y: 0 },
      );

      reactFlowInstance?.setCenter(focalCenter.x, focalCenter.y, {
        duration: 200,
        zoom: 1,
      });
    }
  }, [nodes, reactFlowInstance]);

  const onTraceSource = useCallback(() => {
    if (nodes[0]) {
      const id = nodes[0].id;
      const graph = convertToGraph(reactFlowInstance);
      const foundNodes = createNodeLookup(
        findAllUpstream(id, graph).concat([id]),
      );
      applyFilters(reactFlowInstance, foundNodes);
    }
  }, [nodes, reactFlowInstance]);

  const onTraceTarget = useCallback(() => {
    if (nodes[0]) {
      const id = nodes[0].id;
      const graph = convertToGraph(reactFlowInstance);
      const foundNodes = createNodeLookup(
        findAllDownstream(id, graph).concat([id]),
      );
      applyFilters(reactFlowInstance, foundNodes);
    }
  }, [nodes, reactFlowInstance]);

  const onResetTrace = useCallback(() => {
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((x) => {
        //Remove filtering
        return {
          ...x,
          className: clsx(x.className, {
            filtered: false,
          }),
        };
      }),
    );
  }, [reactFlowInstance]);

  const onDuplicate = useCallback(() => {
    duplicateNodes(nodes.map((x) => x.id));
  }, [duplicateNodes, nodes]);

  const forceExecution = useCallback(() => {
    if (nodes) {
      nodes.forEach((node) => {
        const graphNode = graph.getNode(node.id);
        if (graphNode) {
          graphNode.run();
        }
      });
    }
  }, [graph, nodes]);

  return (
    <Menu id={id}>
      <Item onClick={onDuplicate}>Duplicate</Item>
      <Item onClick={focus}>Focus</Item>
      <Item onClick={forceExecution}>Force Execution</Item>
      <Separator />
      {nodes?.length == 1 && (
        <>
          <Item onClick={onTraceSource}>Trace Upstream</Item>
          <Item onClick={onTraceTarget}>Trace Downstream</Item>
        </>
      )}
      <Item onClick={onResetTrace}>Reset Trace</Item>
      <Separator />
      <Item disabled={!isDeletable} onClick={deleteEl}>
        Delete
      </Item>
    </Menu>
  );
};
