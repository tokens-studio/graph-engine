import { ReduceNode } from '../common/reduceNode.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/multiply.js';

export default WrapNode(ReduceNode, {
  ...node,
  title: 'Multiply',
});
