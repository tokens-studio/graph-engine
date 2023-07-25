import { Checkbox, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../../../components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/accessibility/contrast.js';
import PreviewNumber from '../../preview/number.tsx';
import React, { useMemo } from 'react';

const ContrastNode = (props) => {
  const { input, output, state, setState } = useNode();
  const randomID = useMemo(() => 'x' + Math.random(), []);

  const onChange = (checked) => {
    setState((state) => ({
      ...state,
      absolute: checked,
    }));
  };

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          <Text>Text</Text>
          <Text>
            <PreviewColor value={input.a} />
          </Text>
        </Handle>
        <Handle id="b">
          <Text>Background</Text>
          <Text>
            <PreviewColor value={input.b} />
          </Text>
        </Handle>
        <Stack direction="row" justify="between">
          <Label>Absolute</Label>
          <Checkbox
            id={randomID}
            checked={state.absolute}
            onCheckedChange={onChange}
          />
        </Stack>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewNumber value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ContrastNode, {
  ...node,
  title: 'Contrast',
});
