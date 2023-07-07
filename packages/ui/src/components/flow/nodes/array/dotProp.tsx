import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import React, { useCallback } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/dotProp.js';
import { PreviewAny } from '../../preview/any.tsx';

const DotPropNode = () => {
  const { input, state, setState, output } = useNode();
  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="accessor">
          <Text>Accessor</Text>

          {input.accessor !== undefined ? (
            <PreviewAny value={input.accessor} />
          ) : (
            <TextInput
              onChange={setValue}
              value={state.accessor}
              data-key="accessor"
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

export default WrapNode(DotPropNode, {
  ...node,
  title: 'Extract array property',
});
