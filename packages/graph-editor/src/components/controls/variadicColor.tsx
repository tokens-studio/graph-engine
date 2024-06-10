import React from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import withVariadicField from './withVariadicField';
import { Edge, Port } from '@tokens-studio/graph-engine'

const VariadicColorUI = ({ port, edge }: { port: Port, edge: Edge }) => {
  const value = port.value[edge.annotations['engine.index']];
  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <Box
        as="button"
        css={{
          all: 'unset',
          backgroundColor: value,
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
      <Text>{value}</Text>

    </Stack>
  )
};

export const VariadicColor = withVariadicField(VariadicColorUI);
