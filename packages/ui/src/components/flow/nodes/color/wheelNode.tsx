import { Handle, HandleContainer } from '../../handles.tsx';
import { Label, Stack, TextInput, Tooltip } from '@tokens-studio/ui';
import { LabelNoWrap } from '#/components/label.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/wheel.js';
import { sortEntriesNumerically } from '@tokens-studio/graph-engine/nodes/utils.js';
import PreviewNumber from '../../preview/number.tsx';
import PreviewColor from '../../preview/color.tsx';
import React, { useCallback, useMemo } from 'react';
import chroma from 'chroma-js';

const WheelNode = () => {
  const { output, input, state, setState } = useNode();
  const onChange = useCallback(
    (e: any) => {
      const key = e.target.dataset.key;
      const value = e.target.value;
      setState((state) => ({
        ...state,
        [key]: value,
      }));
    },
    [setState],
  );

  const outputHandles = useMemo(() => {
    const { asArray, ...rest } = output || {};

    return sortEntriesNumerically(Object.entries(rest)).map(([key, value]) => {
      let label;
      try {
        label = chroma(value).css('hsl');
      }
      catch (err) {
        label = 'invalid';
      }
      return (
        <Handle id={key} key={key}>
          <Label>{key}</Label>
          <Tooltip label={label}>
              <PreviewColor value={value} />
          </Tooltip>
        </Handle>
      );
    });
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="hueAmount">
          <LabelNoWrap>Hue Amount</LabelNoWrap>
          {input.hueAmount ? (
            <PreviewNumber value={input.hueAmount} />
          ) : (
            <TextInput data-key="hueAmount" value={state.hueAmount} onChange={onChange} />
          )}
        </Handle>
        <Handle id="hueAngle">
          <LabelNoWrap>Hue Angle</LabelNoWrap>
          {input.hueAngle ? (
            <PreviewNumber value={input.hueAngle} />
          ) : (
            <TextInput
              data-key="hueAngle"
              value={state.hueAngle}
              onChange={onChange}
            />
          )}
        </Handle>
        <Handle id="saturation">
          <LabelNoWrap>Saturation</LabelNoWrap>
          {input.saturation ? (
            <PreviewNumber value={input.saturation} />
          ) : (
            <TextInput
              data-key="saturation"
              value={state.saturation}
              onChange={onChange}
            />
          )}
        </Handle>
        <Handle id="lightness">
          <LabelNoWrap>Lightness</LabelNoWrap>
          {input.lightness ? (
            <PreviewNumber value={input.lightness} />
          ) : (
            <TextInput
              data-key="lightness"
              value={state.lightness}
              onChange={onChange}
            />
          )}
        </Handle>
        <Handle id="colors">
          <LabelNoWrap>Colors</LabelNoWrap>
          {input.colors ? (
            <PreviewNumber value={input.colors} />
          ) : (
            <TextInput
              data-key="colors"
              value={state.colors}
              onChange={onChange}
            />
          )}
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id={'asArray'}>
          <Stack direction="row" justify="between" gap={3} align="center">
            <LabelNoWrap>
              <i>as Array</i>
            </LabelNoWrap>
          </Stack>
        </Handle>
        <Tooltip.Provider>
          {outputHandles}
        </Tooltip.Provider>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(WheelNode, {
  ...node,
  title: 'Color Wheel node',
});
