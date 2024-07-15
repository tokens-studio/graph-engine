import { Box, Stack, Text } from '@tokens-studio/ui';
import { Edge, Port, toColor, toHex } from '@tokens-studio/graph-engine';
import React from 'react';
import withVariadicField from './withVariadicField.js';

const VariadicColorUI = ({ port, edge }: { port: Port; edge: Edge }) => {
  const value = port.value[edge.annotations['engine.index']];

  const hex = toHex(toColor(value));

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <Box
        as="button"
        css={{
          all: 'unset',
          backgroundColor: hex,
          cursor: 'pointer',
          borderRadius: '$small',
          width: 16,
          height: 16,
          outline: '1px solid $borderMuted',
          flexShrink: 0,
          '&:hover': {
            outline: '1px solid $borderDefault',
          },
        }}
        type="button"
      />
      <Text>{hex}</Text>
    </Stack>
  );
};

export const VariadicColor = withVariadicField(VariadicColorUI);
