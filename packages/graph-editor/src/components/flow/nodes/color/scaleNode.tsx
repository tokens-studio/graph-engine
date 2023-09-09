import { DynamicValueText, Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/scale.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';
import { ColorWheelIcon } from '@radix-ui/react-icons';

const ScaleNode = () => {
  const { input, state, output, setState } = useNode();

  console.log("state", state);


  const outputHandles = useMemo(() => {
    const values = output || {};

    const { array, ...rest } = values;

    const handles = Object.entries(rest)
      .sort(([a], [b]) => {
        //Force numeric sorting
        return ~~a < ~~b ? -1 : 1;
      })
      .map(([key, value]) => {
        return (
          <Handle id={key} key={key}>
            <Text css={{
              fontFamily: 'monospace',
              fontSize: '$xsmall',
              color: '$fgMuted',
            }}>{key}</Text>
            <PreviewColor value={value} />
          </Handle>
        );
      });

    return (
      <>
        <Handle id="array">
          <HandleText>Set</HandleText>
          <PreviewArray value={array} />
        </Handle>
        {handles}
      </>
    );
  }, [output]);

  const setStepsUp = useCallback((ev) => {
    const stepsUp = ev.target.value;
    setState((state) => ({
      ...state,
      stepsUp,
    }));
  }, []);

  const setStepsDown = useCallback((ev) => {
    const stepsDown = ev.target.value;
    setState((state) => ({
      ...state,
      stepsDown,
    }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="color">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText>Color</HandleText>
            <PreviewColor value={input.color} />
          </Stack>
        </Handle>
        <Handle id="stepsUp">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps ↑</HandleText>
            {input.stepsUp !== undefined ? (
              <PreviewNumber value={input.stepsUp} />
            ) : (
              <TextInput onChange={setStepsUp} value={state.stepsUp} />
            )}
          </Stack>
        </Handle>
        <Handle id="stepsDown">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps ↓</HandleText>

            {input.stepsDown !== undefined ? (
              <PreviewNumber value={input.stepsDown} />
            ) : (
              <TextInput onChange={setStepsDown} value={state.stepsDown} />
            )}
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">{outputHandles}</HandleContainer>
    </Stack>
  );
};

export default WrapNode(ScaleNode, {
  ...node,
  title: 'Generate Color Scale',
  icon: <ColorWheelIcon />,
});
