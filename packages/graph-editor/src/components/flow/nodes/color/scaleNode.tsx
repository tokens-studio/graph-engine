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
import { BezierCurveEditor } from '#/components/BezierCurveEditor.tsx';
import { BezierIcon } from '#/components/icons/BezierIcon.tsx';
import Color from "colorjs.io"
import { ColorPickerPopover } from '#/components/ColorPickerPopover.tsx';

// We introduce a isSettings prop to the node so we dont have to build the contents twice. Another way to do this would be to have a separate node for the settings and the node itself. Or.. to understand "where am i rendered" in the node itself, but that would be a bit more complex.
const ScaleNode = ({ isSettings }: { isSettings?: boolean }) => {
  const { input, state, output, setState } = useNode();

  const { array = [], ...stops } = output || {};
  const colorStops = useMemo(() => Object.values(stops), [stops]);

  const outputHandles = useMemo(() => {
    const handles = array.sort((a,b) => {
        //Force numeric sorting
        return ~~a.name < ~~b.name ? -1 : 1;
      })
      .map((item, index) => {
        // We want the base to be styled differently so users understand where's their base
        const colorValue = new Color(item.value)
        const isBase = Number(index) + 1 === Number(state.stepsUp) + 1;
        const contrastAgainstWhite = Math.round(colorValue.contrast('white', 'WCAG21') * 100) / 100;
        return (
          <Handle shouldHideHandles={isSettings} id={item.name} key={item.name}>
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
              <Box css={isBase ? { fontWeight: '$sansBold', color: '$fgDefault'} : {}}>{contrastAgainstWhite}</Box>
              <Box css={isBase ? { fontWeight: '$sansBold', color: '$fgDefault'} : {}}>{item.name}</Box>
            </Box>
            <PreviewColor value={item.value} />
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
  }, [state, isSettings, array]);

  const setSteps = useCallback((ev) => {
    const steps = ev.target.value;
    setState((state) => ({
      ...state,
      steps,
    }));
  }, [setState]);

  const handleColorChange = useCallback((color) => {
    setState((state) => ({
      ...state,
      color,
    }));
  }, [setState]);

  const handleChromaCurveValueChange = useCallback((chromaCurve) => {
    setState((state) => ({
      ...state,
      chromaCurve,
    }));
  }, [setState]);

  const handleLightnessCurveChange = useCallback((lightnessCurve) => {
    setState((state) => ({
      ...state,
      lightnessCurve,
    }));
  }, [setState]);

  const handleHueCurveChange = useCallback((hueCurve) => {
    setState((state) => ({
      ...state,
      hueCurve,
    }));
  }, [setState]);

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
        <Handle shouldHideHandles={isSettings} id="color">
          <Stack direction="row" justify="between" gap={3} align="center">
            {input.color ? <PreviewColor value={input.color} /> :  <ColorPickerPopover value={state.color} onChange={handleColorChange} />}
            <HandleText>Color</HandleText>
            <Box css={{fontWeight: '$sansRegular', color: '$fgMuted', fontSize: '$xxsmall', fontFamily: '$mono'}}>{state.color}</Box>
          </Stack>
        </Handle>
        <Handle shouldHideHandles={isSettings} id="steps">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Steps</HandleText>
            {isSettings ? (
              <>
                {input.steps !== undefined ? (
                  <PreviewNumber value={input.steps || state.steps} />
                ) : (
                  <TextInput onChange={setSteps} value={state.steps} />
                )}
              </>
            ) : (
              <DynamicValueText>
                {input.steps || state.steps}
              </DynamicValueText>
            )}
          </Stack>
        </Handle>
        <Handle id="chromaCurve">
          <Stack direction="column">
            <HandleText secondary>Lightness curve</HandleText>
            {isSettings && <BezierCurveEditor value={input.lightnessCurve || state.lightnessCurve} onChange={handleLightnessCurveChange} strict stops={colorStops} />}
          </Stack>
        </Handle>
        <Handle id="saturationCurve">
          <Stack direction="column">
            <HandleText secondary>Chroma curve</HandleText>
            {isSettings && <BezierCurveEditor value={input.chromaCurve || state.chromaCurve} onChange={handleChromaCurveValueChange} stops={colorStops} />}
          </Stack>
        </Handle>
        <Handle id="hueCurve">
          <Stack direction="column">
            <HandleText secondary>Hue curve</HandleText>
            {isSettings && <BezierCurveEditor value={input.hueCurve || state.hueCurve} onChange={handleHueCurveChange} stops={colorStops} canGoNegative />}
          </Stack>
        </Handle>
      </HandleContainer>
      {/* Hide output handles for now. Ideally we'd have a proper way to display outputs here, but I think for now the goal is to get the inputs out of the graph */}
      <HandleContainer shouldHide={isSettings} type="source">
        {outputHandles}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(
  ScaleNode,
  {
    ...node,
    title: 'Generate Color Scale',
    icon: <ColorWheelIcon />,
  },
  <ScaleNode isSettings />,
);
