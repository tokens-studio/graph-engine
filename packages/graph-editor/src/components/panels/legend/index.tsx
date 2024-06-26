import React, { useMemo } from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { icons, typeColorsSelector } from '@/redux/selectors/registry.js';

export const Legend = () => {
  const iconsRegistry = useSelector(icons);
  return <LegendInner iconsRegistry={iconsRegistry} />;
};

export interface ILegendInner {
  iconsRegistry: Record<string, React.ReactNode>;
}


const extractType = (
  id:string, colors: Record<string, {color: string, backgroundColor: string}>
) => {

  console.log(colors)
  const color = colors[id]?.color || 'var(--sky-12)';
  const backgroundColor = colors[id]?.backgroundColor || 'var(--sky-4)';

  return { color, backgroundColor };
};

export const LegendInner = ({ iconsRegistry }: ILegendInner) => {
  const typeColors = useSelector(typeColorsSelector);
  const iconsElements = useMemo(
    () =>
      Object.entries(iconsRegistry).map(([key, value]) => {
        const parts = key.split('/');
        const name = parts[parts.length - 1].split('.')[0];
        const cols = extractType(key, typeColors)

        
        return (
          <Stack gap={3} align="center" key={key}>
            <Box css={{...cols, borderRadius:'$small', padding:'$2'}}>{value}</Box>
            <Text>{name}</Text>
          </Stack>
        );
      }),
    [iconsRegistry, typeColors],
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