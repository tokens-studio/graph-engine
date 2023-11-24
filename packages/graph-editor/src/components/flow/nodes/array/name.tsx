import { Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
  HandleText,
} from '#/components/flow/handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/name.js';
import { PreviewAny } from '../../preview/any.tsx';
import React from 'react';
import { PreviewArray } from '../../preview/array.tsx';

const NameArrayNode = (props) => {
  const { input, output, state, setState } = useNode();

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
          <Text>Output</Text>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(NameArrayNode, {
  ...node,
  title: 'name',
});
