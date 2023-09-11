import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/random.js';
import PreviewNumber from '../../preview/number.tsx';
import React, { useEffect } from 'react';

const RandomNode = (props) => {
  const { state, setState, output } = useNode();

  useEffect(() => {
    if (state.value === undefined) {
      setState((state) => ({ ...state, value: Math.random() }));
    }
  }, [state]);

  return (
    <Stack direction="row" gap={4} css={{ flex: 1 }}>
      <HandleContainer type="source" full>
        <Handle id="output">
          <Stack direction="row" justify="between">
            <Text>Output</Text>
            <PreviewNumber value={output?.output} />
          </Stack>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(RandomNode, {
  ...node,
  title: 'Random',
});
