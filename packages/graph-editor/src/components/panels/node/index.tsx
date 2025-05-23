import { Heading, Label, Separator, Stack, Text } from '@tokens-studio/ui';
import React, { useCallback, useMemo } from 'react';

import { ContentEditableText } from './ContentEditableText.js';
import { ContentEditableTextarea } from './ContentEditableTextarea.js';
import { DynamicInputs } from '../inputs/dynamicInputs.js';
import { Node } from '@tokens-studio/graph-engine';
import { PortPanel } from '@/components/portPanel/index.js';
import { annotatedDynamicInputs } from '@tokens-studio/graph-engine';
import { currentNode } from '@/redux/selectors/graph.js';
import { description, editable, title } from '@/annotations/index.js';
import { inputControls } from '@/redux/selectors/registry.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';

export const NodePanel = () => {
  const graph = useGraph();
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);

  if (!selectedNode) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--component-spacing-md)',
        }}
      >
        <Text muted>Select a node to view its properties</Text>
      </div>
    );
  }

  return <NodePanelContent selectedNode={selectedNode} key={nodeID} />;
};

const NodePanelContent = observer(
  ({ selectedNode }: { selectedNode: Node }) => {
    const inputControlRegistry = useSelector(inputControls);

    const SpecificInput = useMemo(() => {
      return inputControlRegistry[selectedNode?.factory?.type];
    }, [inputControlRegistry, selectedNode]);

    const dynamicInputs = Boolean(
      selectedNode.annotations[annotatedDynamicInputs] &&
        selectedNode.annotations[editable] !== false,
    );

    const onTitleSave = useCallback(
      (newTitle: string) => {
        selectedNode.setAnnotation(title, newTitle);
      },
      [selectedNode],
    );

    const onDescriptionSave = useCallback(
      (newDescription: string) => {
        selectedNode.setAnnotation(description, newDescription);
      },
      [selectedNode],
    );

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
          style={{
            height: '100%',
            flex: 1,
            padding: 'var(--component-spacing-md)',
          }}
        >
          {/* Top Section: Editable Title and Description */}
          <Stack direction="column" gap={3}>
            <ContentEditableText
              value={(selectedNode.annotations[title] as string) || ''}
              placeholder={selectedNode.factory.title || 'Untitled Node'}
              onSave={onTitleSave}
              as="h2"
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-neutral-canvas-default-fg-default)',
              }}
            />

            <ContentEditableTextarea
              value={(selectedNode.annotations[description] as string) || ''}
              placeholder={
                selectedNode.factory.description || 'Add a description...'
              }
              onSave={onDescriptionSave}
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-neutral-canvas-default-fg-muted)',
              }}
            />
          </Stack>

          <Separator orientation="horizontal" />

          {/* First Section: Input Controls */}
          <Stack direction="column" gap={3}>
            <Heading size="small">Inputs</Heading>

            {dynamicInputs && <DynamicInputs node={selectedNode} />}

            {SpecificInput && <SpecificInput node={selectedNode} />}

            {Object.keys(selectedNode.inputs).length > 0 ? (
              <PortPanel
                ports={selectedNode.inputs}
                key={`inputs-${selectedNode.id}`}
              />
            ) : (
              <Text muted size="small">
                No inputs
              </Text>
            )}
          </Stack>

          <Separator orientation="horizontal" />

          {/* Second Section: Output Ports and Values */}
          <Stack direction="column" gap={3}>
            <Heading size="small">Outputs</Heading>
            {Object.keys(selectedNode.outputs).length > 0 ? (
              <PortPanel
                ports={selectedNode.outputs}
                readOnly
                key={`outputs-${selectedNode.id}`}
              />
            ) : (
              <Text muted size="small">
                No outputs
              </Text>
            )}
          </Stack>

          <Separator orientation="horizontal" />

          {/* Third Section: Node Information */}
          <Stack direction="column" gap={2}>
            <Heading size="small">Node Information</Heading>
            <Stack direction="column" gap={1}>
              <Stack direction="row" gap={2} align="center">
                <Label>ID:</Label>
                <Text size="small" muted>
                  {selectedNode.id}
                </Text>
              </Stack>
              <Stack direction="row" gap={2} align="center">
                <Label>Type:</Label>
                <Text size="small" muted>
                  {selectedNode.factory.type}
                </Text>
              </Stack>
              {Object.keys(selectedNode.annotations).length > 2 && (
                <Stack direction="column" gap={1}>
                  <Label>Annotations:</Label>
                  <div style={{ paddingLeft: 'var(--component-spacing-sm)' }}>
                    {Object.entries(selectedNode.annotations)
                      .filter(([key]) => key !== title && key !== description)
                      .map(([key, value]) => (
                        <Stack key={key} direction="row" gap={2} align="center">
                          <Text size="xsmall" muted>
                            {key}:
                          </Text>
                          <Text size="xsmall" muted>
                            {typeof value === 'string'
                              ? value
                              : JSON.stringify(value)}
                          </Text>
                        </Stack>
                      ))}
                  </div>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  },
);
