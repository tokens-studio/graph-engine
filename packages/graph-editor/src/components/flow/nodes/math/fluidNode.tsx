// ui
import { Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
} from '../../../../components/flow/handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/fluid.js';
import PreviewNumber from '../../preview/number.tsx';
import React from 'react';

const FluidValueNode = (props) => {
  const { input, output, state, setState } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="minSize">
          <Text>Min Size</Text>
          <PreviewNumber value={input.minSize} />
        </Handle>
        <Handle id="maxSize">
          <Text>Max Size</Text>
          <PreviewNumber value={input.maxSize} />
        </Handle>
        <Handle id="minViewport">
          <Text>Min Viewport</Text>
          <PreviewNumber value={input.minViewport} />
        </Handle>
        <Handle id="maxViewport">
          <Text>Max Viewport</Text>
          <PreviewNumber value={input.maxViewport} />
        </Handle>
        <Handle id="viewport">
          <Text>Viewport</Text>
          <PreviewNumber value={input.viewport} />
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="fluid">
          <Text>Fluid</Text>
          <PreviewNumber value={output?.clamped} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(FluidValueNode, {
  ...node,
  title: 'Fluid Value',
});
