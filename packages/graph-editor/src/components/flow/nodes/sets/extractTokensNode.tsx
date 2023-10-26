import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { Stack, TextInput, Text, Checkbox } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/extractTokens.js';
import React, { useCallback } from 'react';

const TokenGroupNode = () => {
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
            <TextInput onChange={(e) => setField('name', e.target.value)} value={state.name} data-key="name" />
          )}
        </Handle>
        <Handle id="enableRegex">
          <HandleText>Enable Regex</HandleText>
          <Checkbox
            checked={state.enableRegex}
            onCheckedChange={(checked) => setField('enableRegex', checked)}
          />
        </Handle>
        <Handle id="omitted">
          <HandleText>Omitted</HandleText>
          <Checkbox
            checked={state.omitted}
            onCheckedChange={(checked) => setField('omitted', checked)}
          />
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

export default WrapNode(TokenGroupNode, {
  ...node,
  title: 'Extract Tokens',
});
