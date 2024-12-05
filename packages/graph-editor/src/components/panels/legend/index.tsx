import { Stack, Text } from '@tokens-studio/ui';
import { icons } from '@/redux/selectors/registry.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import colors from '@/tokens/colors.js';

export const Legend = () => {
  const iconsRegistry = useSelector(icons);
  return <LegendInner iconsRegistry={iconsRegistry} />;
};

export interface ILegendInner {
  iconsRegistry: Record<string, React.ReactNode>;
}

const extractType = (id: string) => {
  const color = colors[id]?.color || 'black';
  const backgroundColor = colors[id]?.backgroundColor || 'white';

  return { color, backgroundColor };
};

export const LegendInner = ({ iconsRegistry }: ILegendInner) => {
  const iconsElements = useMemo(
    () =>
      Object.entries(iconsRegistry).map(([key, value]) => {
        const parts = key.split('/');
        const name = parts[parts.length - 1].split('.')[0];
        const cols = extractType(key);

        return (
          <Stack gap={3} align="center" key={key}>
            <div
              style={{
                ...cols,
                borderRadius: 'var(--border-radius-sm)',
                padding: 'var(--component-spacing-sm)',
              }}
            >
              {value}
            </div>
            <Text>{name}</Text>
          </Stack>
        );
      }),
    [iconsRegistry],
  );

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        padding: 'var(--component-spacing-lg)',
        paddingTop: 'var(--component-spacing-xl)',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" gap={4} width="full">
        {iconsElements}
      </Stack>
    </div>
  );
};
