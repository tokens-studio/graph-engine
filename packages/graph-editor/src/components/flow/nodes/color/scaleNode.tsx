import {
  DynamicValueText,
  Handle,
  HandleContainer,
  HandleText,
} from '../../handles.tsx';
import { Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/scale.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';
import { ColorWheelIcon } from '@radix-ui/react-icons';

// We introduce a isSettings prop to the node so we dont have to build the contents twice. Another way to do this would be to have a separate node for the settings and the node itself. Or.. to understand "where am i rendered" in the node itself, but that would be a bit more complex.
const ScaleNode = ({isSettings}: {isSettings?: boolean}) => {
  const { input, state, output, setState } = useNode();

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
          <Handle shouldHideHandles={isSettings} id={key} key={key}>
            <Text
              css={{
                fontFamily: 'monospace',
                fontSize: '$xsmall',
                color: '$fgMuted',
              }}
            >
              {key}
            </Text>
            <PreviewColor value={value} />
          </Handle>
        );
      });

    return (
      <>
        <Handle shouldHideHandles={isSettings} id="array">
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
        <Handle shouldHideHandles={isSettings} id="color">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText>Color</HandleText>
            <PreviewColor value={input.color} />
          </Stack>
        </Handle>
        <Handle shouldHideHandles={isSettings} id="stepsUp">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps ↑</HandleText>
            {isSettings ? <>{input.stepsUp !== undefined ? (
              <PreviewNumber value={input.stepsUp || state.stepsUp} />
            ) : (
              <TextInput onChange={setStepsUp} value={state.stepsUp} />
            )}</> : <DynamicValueText>{input.stepsUp || state.stepsUp}</DynamicValueText>}
          </Stack>
        </Handle>
        <Handle shouldHideHandles={isSettings} id="stepsDown">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps ↓</HandleText>

            {isSettings ? <>{input.stepsDown !== undefined ? (
              <PreviewNumber value={input.stepsDown || state.stepsDown} />
            ) : (
              <TextInput onChange={setStepsDown} value={state.stepsDown} />
            )}</> : <DynamicValueText>{input.stepsDown || state.stepsDown}</DynamicValueText>}
          </Stack>
        </Handle>
      </HandleContainer>
      {/* Hide output handles for now. Ideally we'd have a proper way to display outputs here, but I think for now the goal is to get the inputs out of the graph */}
      <HandleContainer shouldHide={isSettings} type="source">{outputHandles}</HandleContainer>
    </Stack>
  );
};

export default WrapNode(ScaleNode, {
  ...node,
  title: 'Generate Color Scale',
  icon: <ColorWheelIcon />,
}, <ScaleNode isSettings />);
