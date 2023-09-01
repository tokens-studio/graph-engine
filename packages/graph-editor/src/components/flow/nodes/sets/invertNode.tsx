/* eslint-disable no-nested-ternary */
import React from 'react';

import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/invert.js';

export const InvertNode = () => {
  const { input, output } = useNode();
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Input</Text>
          <PreviewArray value={input?.array} />
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(InvertNode, {
  ...node,
  title: 'Invert Set',
});
