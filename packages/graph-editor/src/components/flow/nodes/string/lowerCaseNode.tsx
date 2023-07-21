import { BasicNode } from '../common/basic.tsx';
import { WrapNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/lowercase.js';

export default WrapNode(BasicNode, {
  ...node,
  title: 'Lowercase',
});
