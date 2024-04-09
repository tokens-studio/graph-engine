import React, { useMemo } from 'react';
import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import colorTokens from '../../../tokens/colors.js';
import { useSelector } from 'react-redux';
import { icons } from '@/redux/selectors/registry.js';

export const Legend = () => {
  const colors = useMemo(
    () =>
      Object.entries(colorTokens).map(([key, value]) => {
        return (
          <Stack gap={2} align="center" key={key}>
            <Box

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

  const iconsRegistry = useSelector(icons);
  const iconsElements = useMemo(
    () =>
      Object.entries(iconsRegistry).map(([key, value]) => {
        const parts = key.split('/');
        const name = parts[parts.length - 1].split('.')[0];
        return (
          <Stack gap={2} align="center">
            <Box key={key}>
              <Text>{value}</Text>
            </Box>
            <Text>{name}</Text>
          </Stack>
        );
      }),
    [iconsRegistry],
  );

  return (
    <Box
      css={{
        height: '100%',
        width: '100%',
        backgroundColor: '$bgDefault',
        padding: '$4',
        paddingTop: '$5',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" gap={4} width="full">
        <Heading size="small">Primitive</Heading>

        {colors}
        <Heading size="small">Complex</Heading>
        {iconsElements}
      </Stack>
    </Box>
  );
};
