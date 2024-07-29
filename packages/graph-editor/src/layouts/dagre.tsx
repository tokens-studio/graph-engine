import {
  Edge,
  Node,
  Position,
  ReactFlowState,
  useReactFlow,
  useStore,
} from 'reactflow';
import dagre from 'dagre';

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = 'TB' | 'LR' | 'RL' | 'BT';

export type Options = {
  direction: Direction;
};

const dagreGraph = new dagre.graphlib!.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height,
  );

export function useDagreLayout(
  options: Options | undefined = { direction: 'LR' },
) {
  const { direction } = options;
  const nodesInitialized = useStore(nodesInitializedSelector);
  const { getNodes, getEdges, setNodes } = useReactFlow();

  return () => {
    // only run the layout if there are nodes and they have been initialized with their dimensions
    if (!getNodes().length || !nodesInitialized) {
      return;
    }

    const nodes: Node[] = getNodes();
    const edges: Edge[] = getEdges();

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
      dagreGraph.setNode(node.id, {
        width: node.width ? node.width + 100 : 300,
        height: node.height ? node.height + 100 : 200,
      });
    });

    edges.forEach((edge: Edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    setNodes((nodes) =>
      nodes.map((node) => {
        const { x, y } = dagreGraph.node(node.id);

        return {
          ...node,
          sourcePosition: positionMap[direction[1]],
          targetPosition: positionMap[direction[0]],
          position: { x, y },
          style: { opacity: 1 },
        };
      }),
    );
  };
}
