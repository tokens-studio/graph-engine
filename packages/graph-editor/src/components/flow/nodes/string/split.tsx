import React, { useCallback, useMemo } from 'react';
import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/split.js';
import { PreviewArray } from '../../preview/array.tsx';
import { PreviewAny } from '../../preview/any.tsx';

const SplitStringNode = () => {
  const { input, state, output, setState } = useNode();

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
        <Handle id="string">
          <Text>String</Text>
          <PreviewAny value={input.string} />
        </Handle>

        <Handle id="separator">
          <Text>Separator</Text>
          {input.separator !== undefined ? (
            <PreviewAny value={input.separator} />
          ) : (
            <TextInput
              onChange={setValue}
              value={state.separator}
              data-key="separator"
            />
          )}
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(SplitStringNode, {
  ...node,
  title: 'Split String',
});
