import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify';
import classNames from 'classnames/dedupe.js';
import React, { useCallback } from 'react';
import { ReactFlowInstance, useReactFlow, Node } from 'reactflow';
import { Graph } from 'graphlib';

export interface INodeContextMenuProps {
  id: string;
  node: Node | null;
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
  return nodes.reduce((acc, node) => {
    acc[node] = true;
    return acc;
  }, {} as Record<string, boolean>);
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
          className: classNames(x.className, 'filtered'),
        };
      }
      return {
        ...x,
        className: classNames(x.className, {
          filtered: false,
        }),
      };
    }),
  );
};

export const NodeContextMenu = ({ id, node }: INodeContextMenuProps) => {
  const reactFlowInstance = useReactFlow();

  const deleteEl = useCallback(() => {
    if (node) {
      reactFlowInstance.deleteElements({ nodes: [node] });
    }
  }, [node, reactFlowInstance]);

  const focus = useCallback(() => {
    if (node) {
      reactFlowInstance?.setCenter(
        node.position.x + (node.width || 0) / 2,
        node.position.y + (node.height || 0) / 2,
        {
          duration: 200,
          zoom: 1,
        },
      );
    }
  }, [node, reactFlowInstance]);

  const onTraceSource = useCallback(() => {
    if (node) {
      const id = node.id;
      const graph = convertToGraph(reactFlowInstance);
      const nodes = createNodeLookup(findAllUpstream(id, graph).concat([id]));
      applyFilters(reactFlowInstance, nodes);
    }
  }, [node, reactFlowInstance]);

  const onTraceTarget = useCallback(() => {
    if (node) {
      const id = node.id;
      const graph = convertToGraph(reactFlowInstance);
      const nodes = createNodeLookup(findAllDownstream(id, graph).concat([id]));
      applyFilters(reactFlowInstance, nodes);
    }
  }, [node, reactFlowInstance]);

  const onResetTrace = useCallback(() => {
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((x) => {
        //Remove filtering
        return {
          ...x,
          className: classNames(x.className, {
            filtered: false,
          }),
        };
      }),
    );
  }, [reactFlowInstance]);

  return (
    <Menu id={id}>
      <Item onClick={focus}>Focus</Item>
      <Item onClick={deleteEl}>Delete</Item>
      <Separator />
      <Item onClick={onTraceSource}>Trace Upstream</Item>
      <Item onClick={onTraceTarget}>Trace Downstream</Item>
      <Item onClick={onResetTrace}>Reset Trace</Item>
    </Menu>
  );
};
