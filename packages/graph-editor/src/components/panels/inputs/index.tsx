import React, { useMemo } from 'react';
import { Box, IconButton, Stack, Heading } from '@tokens-studio/ui';

import { currentNode } from '@/redux/selectors/graph';
import { useSelector } from 'react-redux';
import { useGraph } from '@/hooks/useGraph';
import { inputControls } from '@/redux/selectors/registry';
import { PortPanel } from '@/components/portPanel';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export function Inputsheet() {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph.getNode(nodeID), [graph, nodeID]);

  const inputControlRegistry = useSelector(inputControls);
  const SpecificInput = useMemo(() => {
    if (!selectedNode) {
      return null;
    }
    return inputControlRegistry[selectedNode?.factory?.type];
  }, [inputControlRegistry, selectedNode]);

  if (!selectedNode) {
    return <></>;
  }

  return (
    <Box
      css={{
        height: '100%',
        width: '100%',
        background: '$bgDefault',
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
              icon={<InfoCircledIcon />}
            />
          </Stack>
        </Stack>

        <Box css={{ padding: '$3' }}>
          {SpecificInput ? <SpecificInput node={selectedNode} /> : null}
          <Stack width="full" css={{ paddingTop: '$3', paddingBottom: '$3' }}>
            {/* The purpose of the key is to invalidate the port panel if the selected node changes */}
            <PortPanel ports={selectedNode?.inputs} key={selectedNode.id} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
