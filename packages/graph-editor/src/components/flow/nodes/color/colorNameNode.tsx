// ui
import { Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
} from '../../../../components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/name.js';
import { PreviewAny } from '../../preview/any.tsx';
import React from 'react';

const ColorNameNode = (props) => {
  const { input, output, state, setState } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="color">
          <Text>Color</Text>
          <Text>
            <PreviewColor value={input.color} />
          </Text>
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

export default WrapNode(ColorNameNode, {
  ...node,
  title: 'Color Name',
});
