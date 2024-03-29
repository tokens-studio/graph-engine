import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Checkbox, Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/extractSingleToken.js';
import React, { useMemo, useCallback } from 'react';

const ExtractSingleTokenNode = () => {
  const { input, state, output, setState } = useNode();
  const setField = useCallback(
    (key, value) => {
      setState((state) => ({
        ...state,
        [key]: value,
      }));
    },
    [setState],
  );

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

  const entries = useMemo(() => {
    if (!output || typeof output !== 'object') {
      return null;
    }

    return Object.entries(output).map(([key, value]) => (
      <Handle id={key} key={key}>
        <HandleText>{key}</HandleText>
        <PreviewAny value={value} />
      </Handle>
    ));
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="tokens">
          <HandleText>Tokens</HandleText>
          <PreviewAny value={input.tokens} />
        </Handle>
        <Handle id="name">
          <HandleText>Name</HandleText>
          {input.name !== undefined ? (
            <Text>{input.name}</Text>
          ) : (
            <TextInput onChange={setValue} value={state.name} data-key="name" />
          )}
        </Handle>
        <Handle id="enableRegex">
          <HandleText>Enable Regex</HandleText>
          <Checkbox
            checked={state.enableRegex}
            onCheckedChange={(checked) => setField('enableRegex', checked)}
          />
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">{entries}</HandleContainer>
    </Stack>
  );
};

export default WrapNode(ExtractSingleTokenNode, {
  ...node,
  title: 'Extract Single Token',
});
