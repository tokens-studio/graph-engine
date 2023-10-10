import { Handle, HandleContainer, HandleText, InputTypes } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/box.js';
import React from 'react';

const CssBox = () => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle inputType={InputTypes.NUMBER} id="top">
          <HandleText>Top</HandleText>
          <PreviewAny value={input.top} />
        </Handle>
        <Handle inputType={InputTypes.NUMBER} id="right">
          <HandleText>Right</HandleText>
          <PreviewAny value={input.right} />
        </Handle>
        <Handle inputType={InputTypes.NUMBER} id="bottom">
          <HandleText>Bottom</HandleText>
          <PreviewAny value={input.bottom} />
        </Handle>
        <Handle inputType={InputTypes.NUMBER} id="left">
          <HandleText>Left</HandleText>
          <PreviewAny value={input.left} />
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

export default WrapNode(CssBox, {
  ...node,
  title: 'Css Box',
});
