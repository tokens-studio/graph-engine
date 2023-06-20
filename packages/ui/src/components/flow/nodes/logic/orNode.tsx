import { ReduceLogicNode } from '../common/reduceLogicNode.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/logic/or.js';

export default WrapNode(ReduceLogicNode, {
  ...node,
  title: 'Or',
});
