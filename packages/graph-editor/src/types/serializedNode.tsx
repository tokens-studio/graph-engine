import { Node as FlowNode } from 'reactflow';
import { Node } from '@tokens-studio/graph-engine';

export type SerializedNode = {
  engine?: Node;
  editor: FlowNode;
};
