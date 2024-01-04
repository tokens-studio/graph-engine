import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Stack,
  Text,
  Label,
  TextInput,
  Textarea,
} from '@tokens-studio/ui';

import { currentNode } from '@/redux/selectors/graph';
import { useSelector } from 'react-redux';
import { Node } from '@tokens-studio/graph-engine';
import { useGraph } from '@/hooks/useGraph';
import { graphEditorSelector } from '@/redux/selectors/refs';

export function NodeSettingsPanel() {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph.getNode(nodeID), [graph, nodeID]);

  if (!selectedNode) {
    return <></>;
  }

  return (
    <Stack
      direction="column"
      gap={4}
      css={{ height: '100%', flex: 1, padding: '$3' }}
    >
      <Box css={{ padding: '$3' }}>
        <NodeSettings selectedNode={selectedNode} />
      </Box>
    </Stack>
  );
}

const NodeSettings = ({ selectedNode }: { selectedNode: Node }) => {
  const graphRef = useSelector(graphEditorSelector);

  const flow = graphRef.current.getFlow();

  const flowNode = flow.getNode(selectedNode.id);

  const onChangeTitle = useCallback(
    (e) => {
      if (flowNode) {
        flowNode.data.title = e.target.value;
        //Horrible hack to force a re-render
        flow.setNodes((nodes) =>
          nodes.map((x) => {
            if (x.id === flowNode.id) {
              x.data = { ...x.data, title: e.target.value };
            }
            return x;
          }),
        );
      }
    },
    [flow, flowNode],
  );

  const onChangeDesc = useCallback(
    (newString: string) => {
      //Note as there is no UI implication , we do not force a re-render
      if (flowNode) {
        flowNode.data.description = newString;
      }
    },
    [flowNode],
  );

  return (
    <Stack direction="column" gap={2}>
      <Label>Node ID</Label>
      <Text size="xsmall" muted>
        {selectedNode?.id}
      </Text>
      <Label>Node Type</Label>
      <Text size="xsmall" muted>
        {selectedNode?.factory.type}
      </Text>
      <Label>Title</Label>
      <TextInput onChange={onChangeTitle} value={flowNode?.data.description} />
      <Label>Description</Label>
      <Textarea
        placeholder={selectedNode.factory.description}
        onChange={onChangeDesc}
        value={flowNode?.data.description}
      />
    </Stack>
  );
};
