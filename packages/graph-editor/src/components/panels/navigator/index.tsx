import { Stack } from '@tokens-studio/ui';
import React from 'react';

import { graphNodesSelector } from '@/redux/selectors/graph.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useSelector } from 'react-redux';
import { useSubgraphExplorerCallback } from '@/registry/specifics.js';

const SubgraphNodeItem = function ({ node }) {
  const nodeType = node.nodeType();
  const onNodeClick = useSubgraphExplorerCallback(node);

  return (
    <li key={node.id} onClick={onNodeClick}>
      <span>{nodeType}</span>
    </li>
  );
};

export const Navigator = () => {
  const nodes = useSelector(graphNodesSelector);
  const dispatch = useDispatch();

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
      <div style={{ padding: 'var(--component-spacing-md)' }}>
        <ul>
          {Object.values(nodes || {}).map((node) => {
            if (!node['_innerGraph']) return null;
            return <SubgraphNodeItem key={node.id} node={node} />;
          })}
        </ul>
      </div>
    </Stack>
  );
};
