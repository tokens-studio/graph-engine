import { Select, Button, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/typing/passUnit.js';
import { useCallback } from 'react';
import React from 'react';
import unitsData from 'mdn-data/css/units.json' assert { type: 'json' };

// Convert JSON keys to an array of unit strings
const unitOptions = Object.keys(unitsData);

const PassUnit = (props) => {
  const { input, output, state, setState } = useNode();

  const onChangeUnit = useCallback((unit) => {
    setState((state) => ({
      ...state,
      fallback: unit,
    }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="value">
          <Label>Value</Label>
          <Text>{input.value}</Text>
        </Handle>
        <Handle id="fallback">
          <Label>Fallback</Label>

          {input.fallback !== undefined ? (
            <Text>{input.fallback}</Text>
          ) : (
            <Select
              onValueChange={onChangeUnit}
              value={state.fallback || unitOptions[0]}
            >
              <Select.Trigger value={state.fallback || unitOptions[0]} />
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
        <Handle id="output">
          <Label>Output</Label>
          <Text>{output?.output}</Text>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(PassUnit, {
  ...node,
  title: 'Pass Unit',
});
