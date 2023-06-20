import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/slice.js';
import React from 'react';

const SliceNode = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="start">
          <Text>Start</Text>
          <PreviewAny value={input.start} />
        </Handle>
        <Handle id="end">
          <Text>End</Text>
          <PreviewAny value={input.end} />
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

export default WrapNode(SliceNode, {
  ...node,
  title: 'Slice array',
});
