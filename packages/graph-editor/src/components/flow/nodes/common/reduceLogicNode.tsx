import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
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
              <HandleText>{index}</HandleText>
              <PreviewBoolean value={input.value} />
            </Handle>
          );
        })}
        <Handle id={newHandle}>New</Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewBoolean value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};
