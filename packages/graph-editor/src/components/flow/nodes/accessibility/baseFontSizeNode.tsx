// ui
import { Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
} from '../../../../components/flow/handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/accessibility/baseFontSize.js';
import PreviewNumber from '../../preview/number.tsx';
import React from 'react';

const BaseFontSizeNode = (props) => {
  const { input, output, state, setState } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="visualAcuity">
          <Text>Visual Acuity</Text>
          <PreviewNumber value={input.visualAcuity} />
        </Handle>
        <Handle id="lightingCondition">
          <Text>Lighting Condition</Text>
          <PreviewNumber value={input.lightingCondition} />
        </Handle>
        <Handle id="distance">
          <Text>Distance</Text>
          <PreviewNumber value={input.distance} />
        </Handle>
        <Handle id="xHeightRatio">
          <Text>X-Height Ratio</Text>
          <PreviewNumber value={input.xHeightRatio} />
        </Handle>
        <Handle id="ppi">
          <Text>PPI</Text>
          <PreviewNumber value={input.ppi} />
        </Handle>
        <Handle id="pixelDensity">
          <Text>Pixel Density</Text>
          <PreviewNumber value={input.pixelDensity} />
        </Handle>
        <Handle id="correctionFactor">
          <Text>Correction Factor</Text>
          <PreviewNumber value={input.correctionFactor} />
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <Text>Font Size:</Text>
          <PreviewNumber value={output?.fontSizePX} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(BaseFontSizeNode, {
  ...node,
  title: 'Base Font Size',
});
