import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import React from 'react';

import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/logic/if.js';

const IfNode = () => {
  const { output } = useNode();
  return (
    <Stack direction="row">
      <HandleContainer type="target">
        <Handle id="condition">
          <Text>Condition</Text>
        </Handle>
        <Handle id="a">
          <Text>Truthy</Text>
        </Handle>
        <Handle id="b">
          <Text>Falsy</Text>
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

export default WrapNode(IfNode, {
  ...node,
  title: 'If',
});
