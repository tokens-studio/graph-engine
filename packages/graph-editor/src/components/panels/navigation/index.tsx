import React from 'react';

import { MAIN_GRAPH_ID } from '@/constants.js';
import { Stack } from '@tokens-studio/ui';
import { TreeNode, graphNodesSelector } from '@/redux/selectors/graph.js';
import { currentPanelIdSelector } from '@/redux/selectors/graph.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { flow, get, size } from 'lodash-es';
import { useSelector } from 'react-redux';
import { useSubgraphExplorerCallback } from '@/hooks/useSubgraphExplorerCallback.js';
import cx from 'classnames';
import styles from './index.module.css';

type ListItemProps = {
  label: string;
  count?: number;
  isSelected?: boolean;
  onClick?: () => void;
  depth?: number;
};

const ListItem = function ({
  label,
  count,
  isSelected,
  onClick,
  depth = 0,
}: ListItemProps) {
  const style = {
    '--tree-depth': depth,
  } as React.CSSProperties;

  return (
    <li
      className={cx(styles.listItem, {
        [styles.listItemSelected]: isSelected,
      })}
      onClick={onClick}
      style={style}
    >
      <span>{label}</span>
      {count && <span className={styles.listItemCount}>({count})</span>}
    </li>
  );
};

const SubgraphNodeItem = function ({ node, isSelected, depth }) {
  const nodeType = node.factory.title || node.nodeType();
  const onNodeClick = useSubgraphExplorerCallback(node);
  const childNodesCount = flow(
    (x) => get(x, ['_innerGraph', 'nodes'], []),
    size,
  )(node);

  return (
    <ListItem
      label={nodeType}
      onClick={onNodeClick}
      isSelected={isSelected}
      depth={depth}
      count={childNodesCount > 0 && childNodesCount}
    />
  );
};

const RootGraphNodeItem = function () {
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

  return (
    <Stack direction="column" gap={4} className={styles.scrollWrapper}>
      <div className={styles.componentSpacingWrapper}>
        <ul className={styles.listWrapper}>
          <RootGraphNodeItem />
          {Object.values(nodes || {}).map(({ node, depth }: TreeNode) => {
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
