import React, { useMemo } from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { icons } from '@/redux/selectors/registry.js';

export const Legend = () => {
  const iconsRegistry = useSelector(icons);
  return <LegendInner iconsRegistry={iconsRegistry} />;
};

export interface ILegendInner {
  iconsRegistry: Record<string, React.ReactNode>;
}
export const LegendInner = ({ iconsRegistry }: ILegendInner) => {

  const iconsElements = useMemo(
    () =>
      Object.entries(iconsRegistry).map(([key, value]) => {
        const parts = key.split('/');
        const name = parts[parts.length - 1].split('.')[0];
        return (
          <Stack gap={3} align="center">
            <Box css={{color: '$fgDefault'}}>{value}</Box>
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
        padding: '$4',
        paddingTop: '$5',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" gap={4} width="full">
        {iconsElements}
      </Stack>
    </Box>
  );
}