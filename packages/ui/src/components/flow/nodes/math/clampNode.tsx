import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import React, { useCallback } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/clamp.js';
import PreviewNumber from '../../preview/number.tsx';

const ClampNode = (props) => {
  const { input, output, state, setState } = useNode();
  const onMinChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, min: newValue }));
  }, []);

  const onMaxChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, max: newValue }));
  }, []);

  const onValueChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, value: newValue }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="value">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Value</Text>
            {input.value !== undefined ? (
              <Text>{input.value}</Text>
            ) : (
              <TextInput value={state.value} onChange={onValueChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="min">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Min</Text>
            {input.min !== undefined ? (
              <Text>{input.min}</Text>
            ) : (
              <TextInput value={state.min} onChange={onMinChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="max">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Max</Text>
            {input.max !== undefined ? (
              <Text>{input.max}</Text>
            ) : (
              <TextInput value={state.max} onChange={onMaxChange} />
            )}
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Stack direction="row" justify="between" gap={4}>
            <Text>Output</Text>
            <PreviewNumber value={output?.output} />
          </Stack>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ClampNode, {
  ...node,
  title: 'Clamp',
});
