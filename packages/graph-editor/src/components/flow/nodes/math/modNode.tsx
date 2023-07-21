import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/mod.js';
import React from 'react';

const ModNode = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          <Text>A</Text>
          <PreviewAny value={input.a} />
        </Handle>
        <Handle id="b">
          <Text>B</Text>
          <PreviewAny value={input.b} />
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

export default WrapNode(ModNode, {
  ...node,
  title: 'Modulo',
});
