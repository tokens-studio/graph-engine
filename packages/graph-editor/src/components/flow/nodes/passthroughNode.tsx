import { HandleContainer } from '../handles.js';
import { PortArray } from '../wrapper/nodeV2.js';
import { Stack } from '@tokens-studio/ui';
import { useLocalGraph } from '@/context/graph.js';
import React from 'react';

export const PassthroughNode = (args) => {
  const { id } = args;
  const graph = useLocalGraph();
  const node = graph.getNode(id);

  return (
    <Stack direction="column" gap={2}>
      {node && (
        <Stack direction="row" gap={2}>
          <HandleContainer type="target" full>
            <PortArray ports={node.inputs} />
          </HandleContainer>
          <HandleContainer type="source" full>
            <PortArray ports={node.outputs} hideNames />
          </HandleContainer>
        </Stack>
      )}
    </Stack>
  );
};
