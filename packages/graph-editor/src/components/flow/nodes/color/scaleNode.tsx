import {
  DynamicValueText,
  Handle,
  HandleContainer,
  HandleText,
} from '../../handles.tsx';
import { Box, IconButton, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/scale.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { HexColorPicker } from "react-colorful";
import InputPopover from '#/components/InputPopover.tsx';
import { BezierCurveEditor } from '#/components/BezierCurveEditor.tsx';
import { BezierIcon } from '#/components/icons/BezierIcon.tsx';

function ColorPickerPopover({ value, onChange }) {
  return (
  <InputPopover trigger={<Box as="button" css={{all: 'unset', cursor: 'pointer', borderRadius: '$small', backgroundColor: value, width: 16, height: 16, border: '1px solid $borderMuted'}} type="button" />}>
    <ColorPicker value={value} onChange={onChange} />
    {value}
  </InputPopover>)
}

function BezierPopover({ value, onChange }) {
  return (
  <InputPopover trigger={<IconButton variant="invisible" size="small" icon={<BezierIcon />} tooltip="Edit curve" />}>
     <BezierCurveEditor value={value} onChange={onChange} />
  </InputPopover>)
}

function ColorPicker({ value, onChange }) {  
  const handleChange = useCallback(
    (val) => {
      onChange(val);
    },
    [onChange],
    );
    
  return <HexColorPicker color={value} onChange={handleChange} />;
}

const ScaleNode = () => {
  const { input, state, output, setState } = useNode();

  const outputHandles = useMemo(() => {
    const values = output || {};

    const { array = [] } = values;    

    const handles = array.sort((a,b) => {
        //Force numeric sorting
        return ~~a.name < ~~b.name ? -1 : 1;
      })
      .map((item, index) => {
        // We want the base to be styled differently so users understand where's their base
        const isBase = Number(index) + 1 === Number(state.stepsUp) + 1;
        return (
          <Handle id={item.name} key={item.name}>
            <Box
              css={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                fontFamily: 'monospace',
                fontSize: '$xsmall',
                color: '$fgMuted',
              }}
            >
              {isBase ? <Box css={{width: '3px', height: '12px', borderRadius: '100px', background: '$accentDefault'}} /> : null}
              <Box css={isBase ? { fontWeight: '$sansBold', color: '$fgDefault'} : {}}>{item.name}</Box>
            </Box>
            <PreviewColor value={item.value} />
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
  }, [output, state]);

  const setStepsUp = useCallback((ev) => {
    const stepsUp = ev.target.value;
    setState((state) => ({
      ...state,
      stepsUp,
    }));
  }, [setState]);

  const setStepsDown = useCallback((ev) => {
    const stepsDown = ev.target.value;
    setState((state) => ({
      ...state,
      stepsDown,
    }));
  }, [setState]);

  const handleColorChange = useCallback((color) => {
    setState((state) => ({
      ...state,
      color,
    }));
  }, [setState]);

  const handleChromaCurveValueChange = useCallback((chromaCurve) => {
    console.log("Handling chroma curve change", chromaCurve, state)
    setState((state) => ({
      ...state,
      chromaCurve,
    }));
  }, [setState, state]);

  // If the input color changes, update the state so that when we later detach we have the input as the latest value
  React.useEffect(() => {
    if (input.color) {
      setState((state) => ({
        ...state,
        color: input.color,
      }));
    }
  }, [input.color, setState])

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="color">
          <Stack direction="row" justify="between" gap={3} align="center">
            {input.color ? <PreviewColor value={input.color} /> :  <ColorPickerPopover value={state.color} onChange={handleColorChange} />}
            <HandleText>Color</HandleText>
            <Box css={{fontWeight: '$sansRegular', color: '$fgMuted', fontSize: '$xxsmall', fontFamily: '$mono'}}>{state.color}</Box>
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
        <Handle id="chromaCurve">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Distribution curve</HandleText>
            <BezierPopover value={input.chromaCurve || state.chromaCurve} onChange={handleChromaCurveValueChange} />
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
