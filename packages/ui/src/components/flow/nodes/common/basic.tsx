import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { useNode } from '../../wrapper/nodeV2.tsx';
import React from 'react';

export const BasicNode = () => {
  const { input, output } = useNode();
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Text>Input</Text>
          <Text>{input?.input}</Text>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <Text>{output?.output}</Text>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};
