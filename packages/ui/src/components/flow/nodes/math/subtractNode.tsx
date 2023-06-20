import { ReduceNode } from '../common/reduceNode.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/subtract.js';

export default WrapNode(ReduceNode, {
  ...node,
  title: 'Subtract',
});
