import { Handle } from '../handles.js';
import { HandleContainer } from '../handles.js';
import { Stack } from '@tokens-studio/ui';
import { extractType, extractTypeIcon } from '../wrapper/nodeV2.js';
import { icons } from '@/registry/icon.js';
import { useLocalGraph } from '@/context/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const PassthroughNode = (args) => {
  const { id } = args;
  const graph = useLocalGraph();
  const node = graph.getNode(id);
  const iconTypeRegistry = useSelector(icons);

  if (!node) return null;

  const port = node.inputs.value;
  const typeCol = extractTypeIcon(port, iconTypeRegistry);
  const type = extractType(port.type);

  return (
    <Stack
      direction="column"
      style={{
        background: 'var(--color-node-bg)',
        borderRadius: 'var(--component-radii-md)',
        padding: 'var(--size-50)',
        border: '2px solid var(--colors-nodeBorder)',
        boxShadow: 'var(--shadows-contextMenu)',
      }}
    >
      {node && (
        <Stack direction="row">
          <HandleContainer type="target" full>
            <Handle
              {...typeCol}
              visible={port.visible != false || port.isConnected}
              id={port.name}
              type={type}
              isConnected={port.isConnected}
              isAnchor={true}
            ></Handle>
          </HandleContainer>
          <HandleContainer type="source" full>
            <Handle
              {...typeCol}
              visible={port.visible != false || port.isConnected}
              id={port.name}
              type={type}
              isConnected={port.isConnected}
              isAnchor={true}
            ></Handle>
          </HandleContainer>
        </Stack>
      )}
    </Stack>
  );
};
