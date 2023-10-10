import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
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
          <HandleText>Condition</HandleText>
        </Handle>
        <Handle id="a">
          <HandleText>Truthy</HandleText>
        </Handle>
        <Handle id="b">
          <HandleText>Falsy</HandleText>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
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
