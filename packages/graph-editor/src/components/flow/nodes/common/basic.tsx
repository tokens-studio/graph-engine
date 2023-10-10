import { DynamicValueText, Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { Stack } from '@tokens-studio/ui';
import { useNode } from '../../wrapper/nodeV2.tsx';
import React from 'react';

export const BasicNode = () => {
  const { input, output } = useNode();
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <HandleText>Input</HandleText>
          <DynamicValueText>{input?.input}</DynamicValueText>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <DynamicValueText>{output?.output}</DynamicValueText>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};
