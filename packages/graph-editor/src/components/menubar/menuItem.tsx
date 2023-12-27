import React from 'react';
import { Item } from 'rc-menu';
import { Box, Stack, Text } from '@tokens-studio/ui';

export type IMenuItem = React.ComponentProps<typeof Item> & {
  icon?: React.ReactNode;
};

export const MenuItem = ({ icon, children, ...rest }: IMenuItem) => {
  return (
    <Item selectable={false} {...rest}>
      <Stack gap={2} align="center">
        <Box>{icon}</Box>
        <Text>{children}</Text>
      </Stack>
    </Item>
  );
};
