import { Button, IconButton, Stack, Text } from '@tokens-studio/ui';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/arrify.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const ArrifyNode = () => {
  const { input, output, createInput, disconnectInput } = useNode();

  const ref = useRef(input?.inputs?.length || 0);
  useEffect(() => {
    ref.current += 1;
    //We don't care about the values, just the length
  }, [input.inputs]);

  const onClick = useCallback(() => {
    createInput(ref.current);
    ref.current += 1;
  }, []);

  const onDelete = useCallback((ev) => {
    const key = ev.currentTarget.dataset.key;
    disconnectInput(key);
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Stack direction="row" justify="between">
          <Button icon={<PlusIcon />} onClick={onClick}>
            New
          </Button>
        </Stack>
        {input.inputs.map((input, index) => {
          return (
            <Handle id={input.key} key={input.key}>
              <Text>{index}</Text>
              <PreviewAny value={input.value} />
              <IconButton
                data-key={input.key}
                onClick={onDelete}
                icon={<Cross1Icon />}
                variant="invisible"
                size="small"
              />
            </Handle>
          );
        })}
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ArrifyNode, {
  ...node,
  title: 'Create array',
});
