import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/count.js';
import PreviewNumber from '../../preview/number.tsx';
import React from 'react';

const CountNode = () => {
  const { output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Text>
            Input <i> as Array</i>
          </Text>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewNumber value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(CountNode, {
  ...node,
  title: 'Count',
});
