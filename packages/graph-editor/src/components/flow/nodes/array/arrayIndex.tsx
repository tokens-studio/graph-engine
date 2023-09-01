import { Checkbox, Stack, Text, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/indexArray.js';
import React, { useCallback, useMemo } from 'react';

import { Label } from '@radix-ui/react-context-menu';
import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import PreviewNumber from '../../preview/number.tsx';

const ArrayIndexNode = () => {
  const { input, state, setState, output } = useNode();

  const onMonadChange = (checked) => {
    setState((state) => ({
      ...state,
      monad: checked,
    }));
  };

  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const randomID = useMemo(() => 'x' + Math.random(), []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <Text>Array</Text>
        </Handle>
        <Handle id="index">
          <Text>Index</Text>

          {input.index !== undefined ? (
            <PreviewNumber value={input.index} />
          ) : (
            <TextInput
              onChange={setValue}
              value={state.index}
              data-key="index"
            />
          )}
        </Handle>
        <Stack direction="row" justify="between">
          <Label>As Monad</Label>
          <Checkbox
            id={randomID}
            checked={state.monad}
            onCheckedChange={onMonadChange}
          />
        </Stack>
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
export default WrapNode(ArrayIndexNode, {
  ...node,
  title: 'Array Index',
});
