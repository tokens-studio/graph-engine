import ELK, { ElkExtendedEdge, LayoutOptions } from 'elkjs';
import React, { useCallback } from 'react';
import { Edge, useReactFlow, Node } from 'reactflow';

const elk = new ELK();

type LayoutElementsOutput = {
  nodes: Node[];
  edges?: ElkExtendedEdge[];
};

const getLayoutedElements = async (
  nodes,
  edges,
  options = {},
): Promise<LayoutElementsOutput> => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };
  const layoutedGraph = await elk.layout(graph);

  return {
    edges: layoutedGraph.edges,
    nodes: layoutedGraph?.children?.map((node) => ({
      ...node,
      // React Flow expects a position property on the node instead of `x`
      // and `y` fields.
      position: { x: node.x, y: node.y },
    })) as unknown as Node<any>[],
  };
};

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html

export const elkRectOptions: LayoutOptions = {
  'elk.algorithm': 'rectpacking',
  'org.eclipse.elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

export const elkForceOptions: LayoutOptions = {
  'elk.algorithm': 'force',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

export const elkLayeredOptions: LayoutOptions = {
  'elk.algorithm': 'layered',
  'org.eclipse.elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

export const elkStressOptions: LayoutOptions = {
  'elk.algorithm': 'stress',
  'org.eclipse.elk.stress.desiredEdgeLength': '1000',
};

export function useElkLayout() {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  return useCallback(
    async (opts: LayoutOptions) => {
      const nodes = getNodes();
      const edges = getEdges();
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(nodes, edges, opts);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges as unknown as Edge[]);
    },
    [getEdges, getNodes, setEdges, setNodes],
  );
}
