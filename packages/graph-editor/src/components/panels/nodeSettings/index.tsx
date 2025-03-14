import { Label, Stack, Text, TextInput, Textarea } from '@tokens-studio/ui';
import React, { useCallback, useMemo } from 'react';

import { Node } from '@tokens-studio/graph-engine';
import { currentNode } from '@/redux/selectors/graph.js';
import { description, title } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';

export const NodeSettingsPanel = () => {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);

  if (!selectedNode) {
    return <></>;
  }

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
        <NodeSettings
          selectedNode={selectedNode}
          annotations={selectedNode.annotations}
          key={nodeID}
        />
      </div>
    </Stack>
  );
};

const Annotations = observer(({ annotations }: Record<string, unknown>) => {
  return (
    <>
      {Object.entries(annotations as Record<string, unknown>).reduce(
        (acc, [key, value]) => {
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
          })() as string;

          acc.push(
            <Stack direction="column" gap={2} justify="between" key={key}>
              <Label>{key}</Label>
              <Text size="xsmall" muted>
                {val}
              </Text>
            </Stack>,
          );
          return acc;
        },
        [] as JSX.Element[],
      )}
    </>
  );
});

const NodeTitle = observer(({ selectedNode }: { selectedNode: Node }) => {
  const onChangeTitle = useCallback(
    (e) => {
      selectedNode.setAnnotation(title, e.target.value);
    },
    [selectedNode],
  );

  return (
    <Stack direction="column" gap={2}>
      <Label>Title</Label>
      <TextInput
        onChange={onChangeTitle}
        placeholder={selectedNode.factory.title}
        value={(selectedNode.annotations[title] as string) ?? ''}
      />
    </Stack>
  );
});

const NodeDescription = observer(
  ({
    selectedNode,
    annotations,
  }: {
    selectedNode: Node;
    annotations: Record<string, unknown>;
  }) => {
    const onChangeDesc = useCallback(
      (newString: string) => {
        selectedNode.setAnnotation(description, newString);
      },
      [selectedNode],
    );

    return (
      <Stack direction="column" gap={2}>
        <Label>Description</Label>
        <Textarea
          placeholder={selectedNode.factory.description}
          onChange={onChangeDesc}
          value={annotations[description] as string}
        />
      </Stack>
    );
  },
);

const NodeSettings = observer(
  ({
    selectedNode,
    annotations,
  }: {
    selectedNode: Node;
    annotations: Record<string, unknown>;
  }) => {
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
        <NodeDescription
          selectedNode={selectedNode}
          annotations={annotations}
        />
        <Label>Annotations</Label>
        <Annotations annotations={annotations} />
      </Stack>
    );
  },
);
