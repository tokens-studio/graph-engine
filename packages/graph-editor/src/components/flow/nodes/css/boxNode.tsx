import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/box.js';
import React from 'react';

const CssBox = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="top">
          <Text>Top</Text>
          <PreviewAny value={input.top} />
        </Handle>
        <Handle id="right">
          <Text>Right</Text>
          <PreviewAny value={input.right} />
        </Handle>
        <Handle id="bottom">
          <Text>Bottom</Text>
          <PreviewAny value={input.bottom} />
        </Handle>
        <Handle id="left">
          <Text>Left</Text>
          <PreviewAny value={input.left} />
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

export default WrapNode(CssBox, {
  ...node,
  title: 'Css Box',
});
