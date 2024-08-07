import { Box, Heading, IconButton, Stack } from '@tokens-studio/ui';
import { InfoCircleSolid } from 'iconoir-react';
import { Node } from '@tokens-studio/graph-engine';
import { PortPanel } from '@/components/portPanel/index.js';
import { currentNode } from '@/redux/selectors/graph.js';
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
  return (
    <Box
      css={{
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
        css={{ height: '100%', flex: 1, padding: '$3' }}
      >
        <Stack direction="column" gap={3}>
          <Stack gap={2} align="start" justify="between">
            <Heading size="large"> {selectedNode.factory.title}</Heading>
            <IconButton
              tooltip={selectedNode.factory.description}
              icon={<InfoCircleSolid />}
            />
          </Stack>
        </Stack>{' '}
        <OutputSheetObserver node={selectedNode} />
      </Stack>
    </Box>
  );
}

/**
 * We need to wrap an observer around the component to ensure that it re-renders when the node changes
 */
export const OutputSheetObserver = ({ node }: { node: Node }) => {
  return (
    <Box css={{ padding: '$2' }}>
      <Stack width="full" css={{ paddingTop: '$1', paddingBottom: '$1' }}>
        <PortPanel ports={node?.outputs} readOnly key={node.id} />
      </Stack>
    </Box>
  );
};
