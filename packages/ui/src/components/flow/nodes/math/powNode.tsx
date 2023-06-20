import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import React, { useCallback } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/pow.js';
import PreviewNumber from '../../preview/number.tsx';

const PowNode = (props) => {
  const { input, output, state, setState } = useNode();
  const onBaseChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, base: newValue }));
  }, []);

  const onExponentChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, exponent: newValue }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="base">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Base</Text>
            {input.base !== undefined ? (
              <Text>{input.base}</Text>
            ) : (
              <TextInput value={state.base} onChange={onBaseChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="exponent">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Exponent</Text>
            {input.exponent !== undefined ? (
              <Text>{input.exponent}</Text>
            ) : (
              <TextInput value={state.exponent} onChange={onExponentChange} />
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

export default WrapNode(PowNode, {
  ...node,
  title: 'Power',
});
