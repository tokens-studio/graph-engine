import React, { useMemo } from 'react';
import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import colorTokens from '../../../tokens/colors.js';

export const Legend = () => {
  const colors = useMemo(
    () =>
      Object.entries(colorTokens).map(([key, value]) => {
        return (
          <Stack gap={2} align="center">
            <Box
              key={key}
              css={{
                background: value.value,
                height: '12px',
                width: '12px',
                borderRadius: '100%',
              }}
            />
            <Text>{key}</Text>
          </Stack>
        );
      }),
    [],
  );

  return (
    <Stack
      direction="column"
      gap={4}
      width="full"
      css={{
        backgroundColor: '$bgDefault',
        padding: '$4',
        paddingTop: '$5',
      }}
    >
      {colors}
    </Stack>
  );
};
