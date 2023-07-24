import { ReduceLogicNode } from '../common/reduceLogicNode.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/logic/and.js';
import React from 'react';

export default WrapNode(ReduceLogicNode, {
  ...node,
  title: 'And',
});
