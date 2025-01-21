import { Node } from '@tokens-studio/graph-engine';
import { PortPanel } from '@/components/portPanel/index.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { currentNode } from '@/redux/selectors/graph.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import styles from './styles.module.css';

export function OutputSheet() {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);

  if (!selectedNode) {
    return <></>;
  }
  return <OutputSheetObserver node={selectedNode} />;
}

/**
 * We need to wrap an observer around the component to ensure that it re-renders when the node changes
 */
const OutputSheetObserver = observer(({ node }: { node: Node }) => {
  return (
    <Stack direction="column" gap={4} className={styles.outer}>
      <Stack width="full" className={styles.inner}>
        <PortPanel ports={node?.outputs} readOnly key={node.id} />
      </Stack>
    </Stack>
  );
});
