import React, { MutableRefObject, useCallback, useMemo } from 'react';
import Menu, { SubMenu, Item as MenuItem, Divider } from 'rc-menu';
import { Box, Link, Stack, Text } from '@tokens-studio/ui';
import {
  DownloadIcon,
  ExternalLinkIcon,
  FilePlusIcon,
  GearIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import DockLayout, { TabData } from 'rc-dock';
import { Sidesheet } from '../panels/sidesheet';
import { Legend } from '../panels/legend';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react-lite';
import { dockerSelector } from '@/redux/selectors/refs';
import { FlameGraph } from '../panels/flamegraph';
import {
  Menu as MenuData,
  SubMenu as SubMenuData,
  Item as MenuItemData,
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
    <SubMenu title={submenu.title} eventKey={submenu.name}>
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

// export const MenuBar = ({ data }: IMenuBar) => {
//     const dockerRef = useSelector(dockerSelector) as MutableRefObject<DockLayout>;

//     return (
//         <Box css={{ padding: '$2 $3' }}>
//             <Menu
//                 mode={'horizontal'}
//             >
//                 {data.}

// <SubMenu title={'File'} key='file'>
//     <Item icon={<FilePlusIcon />} >New Graph</Item>
//     <Divider />

//     <Item icon={<DownloadIcon />}><u>S</u>ave</Item>
//     <Divider />
// </SubMenu>
//                 <SubMenu title={'Edit'} key='edit'>
//                     <Item >Undo</Item>
//                     <Item >Redo</Item>
//                     <Divider />
//                     <Item icon={<GearIcon />} >Properties</Item>
//                 </SubMenu>
//                 <SubMenu title={'Window'} key='window'>
//                     <Item onClick={onToggleSideSheet} >Sidesheet</Item>
//                     <Item >Nodes</Item>
//                     <Item onClick={onToggleLegend} >Legend</Item>

//                     <Item onClick={onToggleFlamegraph} >Flamegraph</Item>

//                 </SubMenu>
//                 <SubMenu title={'Help'} key='help'>
//                     <Item icon={<ExternalLinkIcon />}>
//                         <Link href="https://docs.graph.tokens.studio/">
//                             Documentation
//                         </Link>
//                     </Item>
//                 </SubMenu>

//             </Menu>
//         </Box>
//     );
// };
