import { Heading, IconButton, Stack } from '@tokens-studio/ui';
import { InfoCircleSolid } from 'iconoir-react';
import { Node } from '@tokens-studio/graph-engine';
import { PortPanel } from '@/components/portPanel/index.js';
import { currentNode } from '@/redux/selectors/graph.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';

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
    <div
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="column"
        gap={4}
        style={{ height: '100%', flex: 1, padding: 'var(--component-spacing-md)' }}
      >
        <Stack direction="column" gap={3}>
          <Stack gap={2} align="start" justify="between">
            <Heading size="large"> {node.factory.title}</Heading>
          </Stack>
        </Stack>

        <div style={{ padding: 'var(--component-spacing-md)' }}>
          <Stack width="full" style={{ paddingTop: 'var(--component-spacing-md)', paddingBottom: 'var(--component-spacing-md)' }}>
            <PortPanel ports={node?.outputs} readOnly key={node.id} />
          </Stack>
        </div>
      </Stack>
    </div>
  );
});
