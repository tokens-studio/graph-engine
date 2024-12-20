import { Stack } from '@tokens-studio/ui';
import React from 'react';

import { dockerSelector } from '@/redux/selectors/refs.js';
import { graphNodesSelector } from '@/redux/selectors/graph.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useSelector } from 'react-redux';
import { useSubgraphExplorerCallback } from '@/hooks/useSubgraphExplorerCallback.js';
import { currentPanelIdSelector } from '@/redux/selectors/graph.js';

const SubgraphNodeItem = function ({ node, isSelected }) {
  const nodeType = node.nodeType();
  const onNodeClick = useSubgraphExplorerCallback(node);

  console.log(isSelected);

  return (
    <li
      key={node.id}
      onClick={onNodeClick}
      style={{ fontWeight: isSelected && 'bold' }}
    >
      <span>{nodeType}</span>
    </li>
  );
};

export const NavigationPanel = () => {
  const nodes = useSelector(graphNodesSelector);
  const activeGraphId = useSelector(currentPanelIdSelector);

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
            const innerGraph = node['_innerGraph'];
            if (!innerGraph) return null;
            console.log('HEY', activeGraphId, node.id, node);
            return (
              <SubgraphNodeItem
                key={node.id}
                isSelected={
                  activeGraphId === innerGraph?.annotations['engine.id']
                }
                node={node}
              />
            );
          })}
        </ul>
      </div>
    </Stack>
  );
};
