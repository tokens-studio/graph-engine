import { Box, Label, Stack, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/extract.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';

const ExtractNode = () => {
  const { input, state, setState, output } = useNode();
  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const outputHandles = useMemo(() => {
    const { asArray, raw, ...rest } = output || {};

    return (
      <>
        <Handle id="asArray">
          As array
          <PreviewArray value={output?.asArray} />
        </Handle>
        {Object.entries(rest).map(([key, value]) => {
          return (
            <Handle id={key} key={key}>
              <Label>{key}</Label>
              <PreviewColor value={value} />
            </Handle>
          );
        })}
      </>
    );
  }, [output]);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          <Handle id="saturationDistance">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Saturation Distance</Label>
              {input.saturationDistance !== undefined ? (
                <PreviewNumber value={input.saturationDistance} />
              ) : (
                <TextInput
                  onChange={setValue}
                  value={state.saturationDistance}
                  data-key="saturationDistance"
                />
              )}
            </Stack>
          </Handle>
          <Handle id="lightnessDistance">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Lightness Distance</Label>
              {input.lightnessDistance !== undefined ? (
                <PreviewNumber value={input.lightnessDistance} />
              ) : (
                <TextInput
                  onChange={setValue}
                  value={state.lightnessDistance}
                  data-key="lightnessDistance"
                />
              )}
            </Stack>
          </Handle>
          <Handle id="hueDistance">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Hue Distance</Label>
              {input.hueDistance !== undefined ? (
                <PreviewNumber value={input.hueDistance} />
              ) : (
                <TextInput
                  onChange={setValue}
                  value={state.hueDistance}
                  data-key="hueDistance"
                />
              )}
            </Stack>
          </Handle>
          <Handle id="distance">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Distance</Label>

              {input.distance !== undefined ? (
                <PreviewNumber value={input.distance} />
              ) : (
                <TextInput
                  onChange={setValue}
                  value={state.distance}
                  data-key="distance"
                />
              )}
            </Stack>
          </Handle>
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Label>Url</Label>
            <TextInput onChange={setValue} value={state.url} data-key="url" />
          </Stack>
        </HandleContainer>
        <HandleContainer type="source">{outputHandles}</HandleContainer>
      </Stack>
      <Box
        css={{
          border: '0.5px solid $borderMuted',
          borderRadius: '$small',
        }}
      >
        <img src={state.url} style={{ width: '100%' }} />
      </Box>
    </Stack>
  );
};

export default WrapNode(ExtractNode, {
  ...node,
  title: 'Extract Colors',
});
