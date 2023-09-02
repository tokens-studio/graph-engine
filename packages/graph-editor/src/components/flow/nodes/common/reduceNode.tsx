import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { useNode } from '../../wrapper/nodeV2.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useMemo, useState } from 'react';

export const ReduceNode = () => {
  const { input, output } = useNode();
  const [nextId, setNextId] = useState(() => input.inputs.length);

  const newHandle = useMemo(() => {
    setNextId(nextId + 1);
    return nextId + 1;
    //We don't care about the values, just the length
  }, [input.inputs]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        {input.inputs.map((input, index) => {
          return (
            <Handle id={input.key} key={input.key}>
              <Text>{index}</Text>
              <PreviewNumber value={input.value} />
            </Handle>
          );
        })}
        <Handle id={newHandle}>
          New
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewNumber value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};
