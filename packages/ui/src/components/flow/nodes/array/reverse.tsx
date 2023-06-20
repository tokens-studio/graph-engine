import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/reverse.js';
import React from 'react';

const ReverseArrayNode = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewAny value={input.array} />
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

export default WrapNode(ReverseArrayNode, {
  ...node,
  title: 'Reverse array',
});
