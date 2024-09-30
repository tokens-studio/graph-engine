import { Box } from '@tokens-studio/ui/Box.js';
import {
  Menu as MenuData,
  MenuItem as MenuItemData,
  SubMenu as SubMenuData,
} from './data.js';
import { observer } from 'mobx-react-lite';
import Menu, { Divider, Item as MenuItem, SubMenu } from 'rc-menu';
import React, { useMemo } from 'react';

export type IItem = React.ComponentProps<typeof MenuItem> & {
  icon?: React.ReactNode;
};
export interface IMenuBar {
  menu: MenuData;
}

const SubMenuObserver = observer(({ submenu }: { submenu: SubMenuData }) => {
  //Note that eventKey should not be used per the docs
  //https://github.com/react-component/menu/blob/master/src/SubMenu/index.tsx
  //However just populating the key seems to be broken
  return (
    <SubMenu
      title={submenu.title}
      eventKey={'xx' + submenu.name}
      key={submenu.name}
    >
      {submenu.items
        .map((item, i) => {
          if (item instanceof MenuItemData) {
            return item.render({ key: item.name });
          } else {
            return <Divider key={i} />;
          }
        })
        .flat()}
    </SubMenu>
  );
});

export const MenuBar = observer(({ menu }: IMenuBar) => {
  const items = useMemo(
    () =>
      menu.items.map((submenu) => {
        return <SubMenuObserver submenu={submenu} key={submenu.name} />;
      }),
    [menu.items],
  );

  return (
    <Box css={{ padding: '$2 $3' }}>
      {/** @ts-expect-error not a valid JSX element apparently */}
      <Menu mode={'horizontal'}>{items}</Menu>
    </Box>
  );
});

export * from './data.js';
export * from './defaults.js';
export * from './menuItem.js';
