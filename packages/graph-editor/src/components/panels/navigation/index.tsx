import { Stack } from '@tokens-studio/ui';
import React from 'react';

import { MAIN_GRAPH_ID } from '@/constants.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { graphNodesSelector } from '@/redux/selectors/graph.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useSelector } from 'react-redux';
import { useSubgraphExplorerCallback } from '@/hooks/useSubgraphExplorerCallback.js';
import { currentPanelIdSelector } from '@/redux/selectors/graph.js';
import styles from './index.module.css';

const ListItem = function ({ label, isSelected, onClick, depth }) {
  return (
    <li
      className={styles.listItem}
      onClick={onClick}
      style={{
        fontWeight: isSelected && 'bold',
        '--tree-depth': depth || 0,
      }}
    >
      <span>{label}</span>
    </li>
  );
};

const SubgraphNodeItem = function ({ node, isSelected, depth }) {
  const nodeType = node.factory.title || node.nodeType();
  const onNodeClick = useSubgraphExplorerCallback(node);

  return (
    <ListItem
      label={nodeType}
      onClick={onNodeClick}
      isSelected={isSelected}
      depth={depth}
    />
  );
};

const RootGraphNodeItem = function ({}) {
  const dockerRef = useSelector(dockerSelector);
  const activeGraphId = useSelector(currentPanelIdSelector);

  return (
    <ListItem
      label={'Root'}
      isSelected={activeGraphId === MAIN_GRAPH_ID}
      onClick={() => dockerRef.current.updateTab(MAIN_GRAPH_ID, null, true)}
    />
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
        <ul className={styles.listWrapper}>
          <RootGraphNodeItem />
          {Object.values(nodes || {}).map(({ node, depth }) => {
            const innerGraph = node['_innerGraph'];
            if (!innerGraph) return null;
            return (
              <SubgraphNodeItem
                key={node.id}
                isSelected={
                  activeGraphId === innerGraph?.annotations['engine.id']
                }
                node={node}
                depth={depth}
              />
            );
          })}
        </ul>
      </div>
    </Stack>
  );
};
