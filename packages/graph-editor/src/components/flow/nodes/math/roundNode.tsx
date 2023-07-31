import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import React, { useCallback } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/round.js';

const RoundNode = (props) => {
  const { input, output, state, setState } = useNode();
  const onPrecisionChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, precision: newValue }));
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
              <Text
                css={{
                  maxWidth: '150px',
                  whiteSpace: 'noWrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {input.value}
              </Text>
            ) : (
              <TextInput value={state.value} onChange={onValueChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="precision">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Precision</Text>
            {input.precision !== undefined ? (
              <Text>{input.precision}</Text>
            ) : (
              <TextInput value={state.precision} onChange={onPrecisionChange} />
            )}
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Stack direction="row" justify="between" gap={4}>
            <Text>Output</Text>
            <Text>{output?.output}</Text>
          </Stack>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(RoundNode, {
  ...node,
  title: 'Round',
});
