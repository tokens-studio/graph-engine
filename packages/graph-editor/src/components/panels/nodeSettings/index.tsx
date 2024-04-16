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
import { observer } from 'mobx-react-lite';
import { description, title } from '@/annotations';

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
      css={{ height: '100%', flex: 1, padding: '$3', overflow: 'auto' }}
    >
      <Box css={{ padding: '$3' }}>
        <NodeSettings selectedNode={selectedNode} key={nodeID} />
      </Box>
    </Stack>
  );
}


interface IAnnotation {
  annotations: Record<string, string>;
}

const Annotations = observer(({ annotations }: IAnnotation) => {

  return <>{Object.entries(annotations).reduce((acc, [key, value]) => {

    switch (key) {
      case title:
      case description:
        return acc;
    }

    const val = (() => {
      switch (typeof value) {
        case 'boolean':
          return value ? 'true' : 'false';
        case 'string':
          return value;
        case 'object':
          return JSON.stringify(value);
        default:
          return value;
      }
    })();

    acc.push((
      <Stack direction="column" gap={2} justify='between' key={key}>
        <Label>{key}</Label>
        <Text size="xsmall" muted>
          {val}
        </Text>
      </Stack>
    ));
    return acc;
  }, [] as JSX.Element[])}
  </>;
});


const NodeTitle = ({ selectedNode }: { selectedNode: Node }) => {
  const onChangeTitle = useCallback(
    (e) => {
      selectedNode.annotations[title] = e.target.value;
    },
    [selectedNode.annotations],
  );

  return (
    <Stack direction='column' gap={2}>
      <Label>Title</Label>
      <TextInput
        onChange={onChangeTitle}
        value={selectedNode.annotations[title]}
      />
    </Stack>
  );
}

const NodeDescription = ({ selectedNode }: { selectedNode: Node }) => {

  const onChangeDesc = useCallback(
    (newString: string) => {
      selectedNode.annotations[description] = newString;
    },
    [selectedNode.annotations],
  );

  return <Stack direction='column' gap={2}>
    <Label>Description</Label>
    <Textarea
      placeholder={selectedNode.factory.description}
      onChange={onChangeDesc}
      value={selectedNode.annotations[description]}
    />
  </Stack>

};


const NodeSettings = ({ selectedNode }: { selectedNode: Node }) => {
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
      <NodeTitle selectedNode={selectedNode} />
      <NodeDescription selectedNode={selectedNode} />
      <Label>Annotations</Label>
      <Annotations annotations={selectedNode.annotations} />
    </Stack>
  );
};
