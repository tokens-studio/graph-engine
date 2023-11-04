import { Box, Checkbox, Label, Stack, Text } from '@tokens-studio/ui';
import {
  Handle,
  HandleContainer,
} from '../../../../components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/accessibility/contrast.js';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';
import { ColorPickerPopover } from '#/components/ColorPickerPopover.tsx';

const ContrastNode = (props) => {
  const { input, output, state, setState } = useNode();
  const randomID = useMemo(() => 'x' + Math.random(), []);

  const onChange = (checked) => {
    setState((state) => ({
      ...state,
      absolute: checked,
    }));
  };

  const handleColorAChange = useCallback((a) => {
    setState((state) => ({
      ...state,
      a,
    }));
  }, [setState]);

  const handleColorBChange = useCallback((b) => {
    setState((state) => ({
      ...state,
      b,
    }));
  }, [setState]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          {input.a ? <PreviewColor value={input.a} /> :  <ColorPickerPopover value={state.a} onChange={handleColorAChange} />}
          <Text>Text</Text>
          <Box css={{fontWeight: '$sansRegular', color: '$fgMuted', fontSize: '$xxsmall', fontFamily: '$mono'}}>{input.a || state.a}</Box>
        </Handle>
        <Handle id="b">
          {input.b ? <PreviewColor value={input.b} /> :  <ColorPickerPopover value={state.b} onChange={handleColorBChange} />}
          <Text>Background</Text>
          <Box css={{fontWeight: '$sansRegular', color: '$fgMuted', fontSize: '$xxsmall', fontFamily: '$mono'}}>{input.b || state.b}</Box>
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
