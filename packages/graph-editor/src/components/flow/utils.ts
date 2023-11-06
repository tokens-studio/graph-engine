import { Edge, Node } from 'reactflow';
import { NodeTypes } from './types.tsx';

export const getOutgoingEdges = (node: Node | undefined, edges: Edge[]) => {
  if (!node) {
    return [];
  }

  return edges.filter((edge) => edge.source === node.id);
};

export const getOutgoingEdgesPairs = (edges: Edge[]) => {
  return edges.map((edge) => {
    return {
      source: edge.source,
      target: edge.target,
    };
  });
};

// we have to make sure that parent nodes are rendered before their children
export const sortNodes = (a: Node, b: Node): number => {
  if (a.type === b.type) {
    return 0;
  }
  return a.type === NodeTypes.GROUP && b.type !== NodeTypes.GROUP ? -1 : 1;
};

export const getId = (prefix = 'node') => `${prefix}_${Math.random() * 10000}`;

export const getNodePositionInsideParent = (
  node: Partial<Node>,
  groupNode: Node,
) => {
  const position = node.position ?? { x: 0, y: 0 };
  const nodeWidth = node.width ?? 0;
  const nodeHeight = node.height ?? 0;
  const groupWidth = groupNode.width ?? 0;
  const groupHeight = groupNode.height ?? 0;

  if (position.x < groupNode.position.x) {
    position.x = 0;
  } else if (position.x + nodeWidth > groupNode.position.x + groupWidth) {
    position.x = groupWidth - nodeWidth;
  } else {
    position.x = position.x - groupNode.position.x;
  }

  if (position.y < groupNode.position.y) {
    position.y = 0;
  } else if (position.y + nodeHeight > groupNode.position.y + groupHeight) {
    position.y = groupHeight - nodeHeight;
  } else {
    position.y = position.y - groupNode.position.y;
  }

  return position;
};
