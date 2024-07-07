import { Box, Stack, Text } from '@tokens-studio/ui';
import { Item } from 'rc-menu';
import React from 'react';

export type IMenuItemElement = React.ComponentProps<typeof Item> & {
  icon?: React.ReactNode;
  /**
   * Needed to hack into the inner part of the menu item
   */
  inner?: (children) => React.ReactNode;
};

/**
 * You must provide a unique key for each item
 */
export const MenuItemElement = ({
  icon,
  inner = (children) => children,
  children,
  ...rest
}: IMenuItemElement) => {
  return (
    // @ts-expect-error This is the correct attribute
    <Item selectable={'false'} {...rest}>
      {inner(
        <Stack gap={2} align="center">
          <Box>{icon}</Box>
          <Text>{children}</Text>
        </Stack>,
      )}
    </Item>
  );
};
