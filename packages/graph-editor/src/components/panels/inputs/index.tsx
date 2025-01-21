import { DynamicInputs } from './dynamicInputs.js';
import { PortPanel } from '@/components/portPanel/index.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { annotatedDynamicInputs } from '@tokens-studio/graph-engine';
import { currentNode } from '@/redux/selectors/graph.js';
import { editable } from '@/annotations/index.js';
import { inputControls } from '@/redux/selectors/registry.js';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import styles from '../output/styles.module.css';

export function Inputsheet() {
  const graph = useGraph();

  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);

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

  const dynamicInputs = Boolean(
    selectedNode.annotations[annotatedDynamicInputs] &&
      selectedNode.annotations[editable] !== false,
  );

  return (
    <Stack direction="column" gap={4} className={styles.outer}>
      {dynamicInputs && <DynamicInputs node={selectedNode} />}

      {SpecificInput ? <SpecificInput node={selectedNode} /> : null}
      <Stack width="full" className={styles.inner}>
        {/* The purpose of the key is to invalidate the port panel if the selected node changes */}
        <PortPanel ports={selectedNode?.inputs} key={selectedNode.id} />
      </Stack>
    </Stack>
  );
}
