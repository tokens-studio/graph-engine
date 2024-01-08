import { Node } from 'reactflow';
import { CompactNode } from './compact';

export const uncompactNode = (node: CompactNode[]): Node[] => {
  //@ts-expect-error This typing is correct
  return node.map((node) => {
    return {
      dragging: false,
      selected: false,
      data: {},
      ...node,
    };
  });
};
