import React from 'react';
import { Stack, TextInput } from '@tokens-studio/ui';
import { withVariadicField } from '@tokens-studio/graph-editor';
import { Edge, Port } from '@tokens-studio/graph-engine';
import { getPreview } from './token';

const VariadicTokensUI = ({ port, edge }: { port: Port, edge: Edge }) => {
  const value = port.value[edge.annotations['engine.index']];
  if (!Array.isArray(value))
    return null;

  console.log({ setValue: value })
  return (
    <Stack
      gap={2}
      align="center"
      title={`${port.name} - ${edge.annotations['engine.index']}`}
      css={{ padding: '$3', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      {(value || []).map((token) => (
        getPreview(token)
      ))}
    </Stack>
  )
};

export const VariadicTokenSet = withVariadicField(VariadicTokensUI);