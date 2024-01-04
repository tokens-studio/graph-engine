import React, { useMemo } from 'react';
import Menu, { SubMenu, Item as MenuItem, Divider } from 'rc-menu';
import { Box } from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import {
  Menu as MenuData,
  SubMenu as SubMenuData,
  MenuItem as MenuItemData,
} from './data';

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
    <SubMenu title={submenu.title} eventKey={'xx' + submenu.name}>
      {submenu.items.map((item) => {
        if (item instanceof MenuItemData) {
          return item.render();
        } else {
          return <Divider />;
        }
      })}
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
      <Menu mode={'horizontal'}>{items}</Menu>
    </Box>
  );
});

export * from './data.js';
export * from './defaults.js';
export * from './menuItem.js';
