import { Label, Stack, Text } from '@tokens-studio/ui';
import { DynamicValueText, Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/typing/parseUnit.js';
import { PreviewAny } from '../../preview/any.tsx';
import React from 'react';

const ParseUnit = (props) => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <HandleText>Input</HandleText>
          <DynamicValueText>{input.input}</DynamicValueText>
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="number">
          <HandleText>Number</HandleText>
          <PreviewAny value={output?.number} />
        </Handle>
        <Handle id="unit">
          <HandleText>Unit</HandleText>
          <PreviewAny value={output?.unit} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ParseUnit, {
  ...node,
  title: 'Parse Unit',
});
