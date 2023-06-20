import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/join.js';
import React, { useCallback } from 'react';

const JoinNode = () => {
  const { input, state, setState, output } = useNode();
  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  console.log(output);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="delimiter">
          <Text>Delimiter</Text>

          {input.delimiter !== undefined ? (
            <PreviewAny value={input.delimiter} />
          ) : (
            <TextInput
              onChange={setValue}
              value={state.delimiter}
              data-key="delimiter"
            />
          )}
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(JoinNode, {
  ...node,
  title: 'Join array',
});
