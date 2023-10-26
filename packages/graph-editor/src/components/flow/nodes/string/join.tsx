import React from 'react';
import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/join.js';
import { PreviewArray } from '../../preview/array.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { useCallback } from 'react';

const JoinStringNode = () => {
  const { input, state, setState, output } = useNode();

  const setValue = useCallback(
    (ev) => {
      const value = ev.target.value;
      const key = ev.currentTarget.dataset.key;

      setState((state) => ({
        ...state,
        [key]: value,
      }));
    },
    [setState],
  );

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewArray value={input.array} />
        </Handle>

        <Handle id="separator">
          <Text>Separator</Text>
          {input.separator !== undefined ? (
            <PreviewAny value={input.separator} />
          ) : (
            <TextInput
              value={state.seperator}
              data-key="separator"
              placeholder="Enter separator"
              onChange={setValue}
            />
          )}
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(JoinStringNode, {
  ...node,
  title: 'Join String',
});
