import { Checkbox, Label, Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
  HandleText,
  InputTypes,
} from '../../../../components/flow/handles.tsx';
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
        <Handle id="a" inputType={InputTypes.COLOR}>
          <HandleText>Text</HandleText>
          <PreviewColor value={input.a} />
        </Handle>
        <Handle id="b" inputType={InputTypes.COLOR}>
          <HandleText>Background</HandleText>
          <PreviewColor value={input.b} />
        </Handle>
        <Stack direction="row" justify="start" align="center">
          <HandleText>Absolute</HandleText>
          <Checkbox
            id={randomID}
            checked={state.absolute}
            onCheckedChange={onChange}
          />
        </Stack>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
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
