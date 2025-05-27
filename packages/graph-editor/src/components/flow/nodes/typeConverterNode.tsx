import { Handle } from '../handles.js';
import { HandleContainer } from '../handles.js';
import { Stack, Text } from '@tokens-studio/ui';
import { extractType, extractTypeIcon } from '../wrapper/nodeV2.js';
import { icons } from '@/registry/icon.js';
import { useLocalGraph } from '@/context/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const TypeConverterNode = (args) => {
  const { id } = args;
  const graph = useLocalGraph();
  const node = graph.getNode(id);
  const iconTypeRegistry = useSelector(icons);

  if (!node) return null;

  const inputPort = node.inputs.value;
  const outputPort = node.outputs.value;
  const inputTypeCol = extractTypeIcon(inputPort, iconTypeRegistry);
  const outputTypeCol = extractTypeIcon(outputPort, iconTypeRegistry);
  const inputType = extractType(inputPort.type);
  const outputType = extractType(outputPort.type);

  // Get conversion description from node annotations
  const conversionDescription =
    (node.annotations['conversion.description'] as string) || 'TYPE';

  return (
    <Stack
      direction="column"
      style={{
        background: 'var(--color-node-bg)',
        borderRadius: 'var(--component-radii-md)',
        padding: 'var(--component-spacing-xs)',
        border: '2px solid var(--colors-nodeBorder)',
        boxShadow: 'var(--shadows-contextMenu)',
        minWidth: '60px',
        position: 'relative',
      }}
    >
      <Stack direction="row" align="center" justify="between">
        <HandleContainer type="target" full>
          <Handle
            {...inputTypeCol}
            visible={inputPort.visible != false || inputPort.isConnected}
            id={inputPort.name}
            type={inputType}
            isConnected={inputPort.isConnected}
            isAnchor={true}
          />
        </HandleContainer>

        <Stack
          direction="column"
          align="center"
          style={{ flex: 1, minWidth: 0 }}
        >
          <Text
            size="xsmall"
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'var(--colors-fg-muted)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {conversionDescription}
          </Text>
        </Stack>

        <HandleContainer type="source" full>
          <Handle
            {...outputTypeCol}
            visible={outputPort.visible != false || outputPort.isConnected}
            id={outputPort.name}
            type={outputType}
            isConnected={outputPort.isConnected}
            isAnchor={true}
          />
        </HandleContainer>
      </Stack>
    </Stack>
  );
};
