import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewBoolean } from '../../preview/boolean.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { useNode } from '../../wrapper/nodeV2.tsx';
import React, { useMemo, useState } from 'react';

export const ReduceLogicNode = () => {
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
              <PreviewBoolean value={input.value} />
            </Handle>
          );
        })}
        <Handle id={newHandle}>
          <Text>
            <i>New</i>
          </Text>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewBoolean value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};
