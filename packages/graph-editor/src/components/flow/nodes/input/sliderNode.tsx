import { Handle, HandleContainer } from '../../handles.tsx';
import { Box, Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { Slider } from '../../../../components/slider/index.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/input/slider.js';
import React, { useCallback } from 'react';

const SliderNode = () => {
  const { state, setState } = useNode();
  const { value = 50, max = 100, step = 1 } = state;

  const onChange = useCallback((newValue: [number]) => {
    setState((state) => ({ ...state, value: newValue }));
  }, []);

  const onStepChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, step: newValue }));
  }, []);

  const onMaxChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, max: newValue }));
  }, []);

  return (
    <Stack direction="column" gap={3}>
      <HandleContainer full type="source">
        <Handle id="output">
          <Slider
            value={[value]}
            onValueChange={onChange}
            defaultValue={[0.5]}
            max={max}
            step={step}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb>
              <Slider.ValueLabel>
                <Box
                  css={{
                    padding: '$3',
                    border: '1px solid $borderMuted',
                    borderRadius: '$medium',
                  }}
                >
                  <Label> {value}</Label>
                </Box>
              </Slider.ValueLabel>
            </Slider.Thumb>
          </Slider>
        </Handle>
      </HandleContainer>
      <Stack direction="row" gap={4} justify="between" align="center">
        <Label>Max</Label>
        <TextInput type="number" value={max} onChange={onMaxChange} />
      </Stack>
      <Stack direction="row" gap={4} justify="between" align="center">
        <Label>Step</Label>
        <TextInput type="number" value={step} onChange={onStepChange} />
      </Stack>
    </Stack>
  );
};

export default WrapNode(SliderNode, {
  ...node,
  title: 'Slider',
});
