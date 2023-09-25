import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import {
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import {
  node,
} from '@tokens-studio/graph-engine/nodes/set/group.js';
import React, { useCallback } from 'react';

const TokenGroupNode = () => {
  const { input, state, output, setState } = useNode();
  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    console.log("value", value, key, ev);
    
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);  

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="tokens">
          <HandleText>Tokens</HandleText>
          <PreviewAny value={input.tokens} />
        </Handle>
        <Handle id="name">
          <HandleText>Name</HandleText>
          <TextInput
              onChange={setValue}
              value={state.name}
              data-key="name"
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
  title: 'Token Group',
});