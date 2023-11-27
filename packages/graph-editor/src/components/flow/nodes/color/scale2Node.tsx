import {
  DynamicValueText,
  Handle,
  HandleContainer,
  HandleText,
} from '../../handles.tsx';
import { Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/scale2.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';
import { PaintbucketIcon } from '@iconicicons/react';
import { ColorPickerPopover } from '#/components/ColorPicker.tsx';

const Scale2Node = () => {
  const { input, state, output, setState } = useNode();

  console.log("Output", output)

  const handleColorChange = useCallback(
    (color) => {
      setState((state) => ({
        ...state,
        color,
      }));
    },
    [setState],
  );

  const setMin = useCallback((ev) => {
    const min = ev.target.value;
    setState((state) => ({
      ...state,
      min,
    }));
  }, [setState]);

  const setMax = useCallback((ev) => {
    const max = ev.target.value;
    setState((state) => ({
      ...state,
      max,
    }));
  }, [setState]);

  const outputHandles = useMemo(() => {
    const values = output || {};

    const { array, closestStepIndex, ...rest } = values;

    const handles = Object.entries(rest)
      .sort(([a], [b]) => {
        //Force numeric sorting
        return ~~a < ~~b ? -1 : 1;
      })
      .map(([key, value], index) => {
        return (
          <Handle id={key} key={key}>
            <Text
              css={{
                fontFamily: 'monospace',
                fontSize: '$xsmall',
                color: '$fgMuted',
              }}
            >
              {index === closestStepIndex ? '➡️' : ''}
              {index}
            </Text>
            <PreviewColor value={value} />
          </Handle>
        );
      });

    return (
      <>
        <Handle id="array">
          <HandleText>Set</HandleText>
          <PreviewArray value={array}  />
        </Handle>
        {handles}
      </>
    );
  }, [output]);

  const setSteps = useCallback((ev) => {
    const steps = ev.target.value;
    setState((state) => ({
      ...state,
      steps,
    }));
  }, [setState]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="color">
          <Stack direction="row" justify="between" gap={3} align="center">
            <ColorPickerPopover value={state.color} onChange={handleColorChange}  />
            <HandleText>Color</HandleText>
            <PreviewColor value={input.color} />
          </Stack>
        </Handle>
        <Handle id="steps">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps</HandleText>
            {input.steps !== undefined ? (
              <PreviewNumber value={input.steps} />
            ) : (
              <TextInput onChange={setSteps} value={state.steps} />
            )}
          </Stack>
        </Handle>
        <Handle id="min">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Min</HandleText>
            {input.min !== undefined ? (
              <PreviewNumber value={input.min} />
            ) : (
              <TextInput onChange={setMin} value={state.min} />
            )}
          </Stack>
        </Handle>
        <Handle id="max">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Max</HandleText>
            {input.max !== undefined ? (
              <PreviewNumber value={input.max} />
            ) : (
              <TextInput onChange={setMax} value={state.max} />
            )}
          </Stack>
        </Handle>

      </HandleContainer>
      <HandleContainer type="source">{outputHandles}</HandleContainer>
    </Stack>
  );
};

export default WrapNode(Scale2Node, {
  ...node,
  title: 'Generate Color Scale',
  icon: <PaintbucketIcon />,
});
