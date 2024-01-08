import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/flatten.js';

const SquashNode = () => {
  const { input } = useNode();

  const [nextId, setNextId] = useState(() => input.inputs.length);

  const newHandle = useMemo(() => {
    setNextId(nextId + 1);
    return nextId + 1;
    //We don't care about the values, just the length
  }, [input.inputs]);

  const handles = useMemo(() => {
    return input.inputs.map((input, index) => {
      return (
        <Handle id={input.key} key={input.key}>
          <Stack direction="row" justify="between">
            <Text>{index}</Text>
            <Text>{!input.value && 'Missing'}</Text>
          </Stack>
        </Handle>
      );
    });
  }, [input.inputs]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        {handles}
        <Handle id={`inputs.${newHandle}`}>New</Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Stack direction="row" justify="between">
            <Text>Output</Text>
          </Stack>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(SquashNode, {
  ...node,
  title: 'Flatten Set',
});
