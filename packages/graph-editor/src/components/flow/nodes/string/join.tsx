import React from 'react';
import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/join.js';
import { PreviewArray } from '../../preview/array.tsx';
import { PreviewAny } from '../../preview/any.tsx';

const JoinStringNode = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewArray value={input.array} />
        </Handle>

        <Handle id="separator">
          <Text>Separator</Text>
          {input.separator !== undefined ? (
            <PreviewAny value={input.separator} />
          ) : (
            <TextInput placeholder="Enter separator" />
          )}
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

export default WrapNode(JoinStringNode, {
  ...node,
  title: 'Join String',
});
