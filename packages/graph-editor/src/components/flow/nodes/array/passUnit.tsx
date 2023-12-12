import { Label, Select, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/passUnit.js';
import { useCallback, useMemo } from 'react';
import React from 'react';
import unitsData from 'mdn-data/css/units.json' assert { type: 'json' };

// Convert JSON keys to an array of unit strings
const unitOptions = Object.keys(unitsData);

const ArrayPassUnit = (props) => {
  const { input, output, state, setState } = useNode();

  const onChangeUnit = useCallback((unit) => {
    setState((state) => ({
      ...state,
      unit: unit,
    }));
  }, []);

  const outputHandles = useMemo(() => {
    const { asArray, ...rest } = output || {};

    return Object.entries(rest).map(([key, value]) => {
      return (
        <Handle id={key} key={key}>
          <Stack direction="row" justify="between" gap={5} align="center">
            <Label>{key}</Label>
            <PreviewAny value={value} />
          </Stack>
        </Handle>
      );
    });
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="value">
          <Label>Array</Label>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="unit">
          <Label>Unit</Label>

          {input.unit !== undefined ? (
            <Text>{input.unit}</Text>
          ) : (
            <Select
              onValueChange={onChangeUnit}
              value={state.unit || unitOptions[0]}
            >
              <Select.Trigger value={state.unit || unitOptions[0]} />
              <Select.Content>
                {unitOptions.map((unit) => (
                  <Select.Item key={unit} value={unit}>
                    {unit}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id={'asArray'}>as Array</Handle>
        {outputHandles}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ArrayPassUnit, {
  ...node,
  title: 'Array Pass Unit',
});
