import { Edge, Node } from 'reactflow';

export type CompactEdge = Omit<Edge, 'style' | 'type' | 'data'>;
export type CompactNode = Omit<Edge, 'dragging' | 'selected' | 'data'>;

export const compactEdges = (edges: Edge[]): CompactEdge[] => {
  const compactEdges: CompactEdge[] = edges.map((edge) => {
    const { data, style, type, ...rest } = edge;

    if (data && Object.keys(data).length > 0) {
      //@ts-ignore
      rest.data = data;
    }
    return rest;
  });
  return compactEdges;
};

export const compactNodes = (nodes: Node[]): CompactNode[] => {
  //@ts-expect-error This typing is incorrect
  const compacted: CompactNode[] = nodes.map((node) => {
    const { dragging, selected, data, ...rest } = node;

    if (data && Object.keys(data).length > 0) {
      //@ts-ignore
      rest.data = data;
    }
    return rest;
  });
  return compacted;
};
