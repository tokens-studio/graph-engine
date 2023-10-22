import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/ungroup.js';
import React from 'react';

const TokenUngroupNode = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="tokens">
          <HandleText>Tokens</HandleText>
          <PreviewAny value={input.tokens} />
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(TokenUngroupNode, {
  ...node,
  title: 'Token Ungroup',
});
