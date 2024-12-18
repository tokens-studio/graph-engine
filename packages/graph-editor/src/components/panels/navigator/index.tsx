import { Label, Stack, Text, TextInput, Textarea } from '@tokens-studio/ui';
import React, { useCallback, useMemo } from 'react';

import { Node } from '@tokens-studio/graph-engine';
import { currentNode, graphNodesSelector } from '@/redux/selectors/graph.js';
import { description, title } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';

export const Navigator = () => {
  const graph = useGraph();
  const nodes = useSelector(graphNodesSelector);

  console.log(nodes);

  return (
    <Stack
      direction="column"
      gap={4}
      style={{
        height: '100%',
        flex: 1,
        padding: 'var(--component-spacing-md)',
        overflow: 'auto',
      }}
    >
      <div style={{ padding: 'var(--component-spacing-md)' }}>Yaw</div>
    </Stack>
  );
};
