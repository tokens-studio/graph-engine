import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import React, { useCallback } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/lerp.js';
import PreviewNumber from '../../preview/number.tsx';

const LerpNode = (props) => {
  const { state, input, output, setState } = useNode();
  const onAChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, a: newValue }));
  }, []);
  const onBChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, b: newValue }));
  }, []);
  const onTChange = useCallback((e) => {
    const newValue = e.target.value;
    setState((state) => ({ ...state, t: newValue }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>a</Text>
            {input.a !== undefined ? (
              <Text>{input.a}</Text>
            ) : (
              <TextInput value={state.a} onChange={onAChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="b">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>b</Text>
            {input.b !== undefined ? (
              <Text>{input.b}</Text>
            ) : (
              <TextInput value={state.b} onChange={onBChange} />
            )}
          </Stack>
        </Handle>
        <Handle id="t">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>t</Text>
            {input.t !== undefined ? (
              <Text>{input.t}</Text>
            ) : (
              <TextInput value={state.t} onChange={onTChange} />
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

export default WrapNode(LerpNode, {
  ...node,
  title: 'Lerp',
});
