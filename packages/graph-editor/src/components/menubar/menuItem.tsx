import React from 'react';
import { Item } from 'rc-menu';
import { Box, Stack, Text } from '@tokens-studio/ui';

export type IMenuItemElement = React.ComponentProps<typeof Item> & {
  icon?: React.ReactNode;
};

export const MenuItemElement = ({
  icon,
  children,
  ...rest
}: IMenuItemElement) => {
  return (
    // @ts-expect-error This is the correct attribute
    <Item selectable={false} {...rest}>
      <Stack gap={2} align="center">
        <Box>{icon}</Box>
        <Text>{children}</Text>
      </Stack>
    </Item>
  );
};
