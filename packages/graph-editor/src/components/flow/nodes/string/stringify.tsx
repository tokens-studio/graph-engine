import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/stringify.js';
import { Stack, Text } from '@tokens-studio/ui';
import React from 'react';
import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';

export const BasicNode = () => {
  const { input, output } = useNode();
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Text>Input</Text>
          <PreviewAny value={input?.input} />
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(BasicNode, {
  ...node,
  title: 'Stringify',
});
