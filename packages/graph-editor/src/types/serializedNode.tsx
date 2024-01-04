import { Node } from '@tokens-studio/graph-engine';
import { Node as FlowNode } from 'reactflow';

export type SerializedNode = {
  engine?: Node;
  editor: FlowNode;
};
