import {
  Accordion,
  Heading,
  IconButton,
  Separator,
  Stack,
} from '@tokens-studio/ui';
import { InfoCircle } from 'iconoir-react';
import { Inputsheet } from '../inputs/index.js';
import { OutputSheet } from '../output/index.js';
import { currentNode } from '@/redux/selectors/graph.js';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import styles from './styles.module.css';

export function UnifiedSheet() {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);

  if (!selectedNode) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <Stack direction="column" gap={2} className={styles.inner}>
        <Stack direction="column" gap={3}>
          <Stack gap={2} align="start" justify="between">
            <Heading size="large"> {selectedNode.factory.title}</Heading>
            <IconButton
              size="small"
              tooltip={selectedNode.factory.description}
              icon={<InfoCircle />}
            />
          </Stack>
        </Stack>
        <Accordion type="multiple" defaultValue={['inputs', 'outputs']}>
          <Accordion.Item value="inputs">
            <Accordion.Trigger>Inputs</Accordion.Trigger>
            <Accordion.Content>
              <Separator orientation="horizontal" />
              <Inputsheet />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="outputs">
            <Accordion.Trigger>Outputs</Accordion.Trigger>
            <Accordion.Content>
              <Separator orientation="horizontal" />
              <OutputSheet />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </div>
  );
}
