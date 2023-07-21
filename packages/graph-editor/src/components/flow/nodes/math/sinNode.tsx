import { BasicNumericNode } from '../common/basicNumeric.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/sin.js';

export default WrapNode(BasicNumericNode, {
  ...node,
  title: 'Sin',
});
