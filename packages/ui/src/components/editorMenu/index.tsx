import { BookIcon, MoonIcon, SunIcon } from '@iconicicons/react';
import {
  Seperator,
  MenuItemElement,
  defaultMenuDataFactory,
  MenuItem,
  SubMenu,
  defaultPanelGroupsFactory,
  PanelItem,
  PanelGroup,
} from '@tokens-studio/graph-editor';
import React, { useCallback } from 'react';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';
import YoutubeIcon from '@/assets/svgs/youtube.svg';
import SlackIcon from '@/assets/svgs/slack.svg';
import { nodeLookup } from '@tokens-studio/graph-engine';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';

export const menu = defaultMenuDataFactory();

/**
 * Disabled for now as immediate node needs to be a MenuItemElement
 */
// const ToggleTheme = observer(
//   ({ theme }: { theme: GlobalState['ui']['theme'] }) => {
//     const theTheme = theme.get();
//     const toggleTheme = useCallback(() => {
//       globalState.ui.theme.set(theTheme === 'light' ? 'dark' : 'light');
//     }, [theTheme]);

//     return (
//       <MenuItemElement
//         onClick={toggleTheme}
//         icon={theTheme === 'light' ? <MoonIcon /> : <SunIcon />}
//         key="toggleTheme"
//       >
//         Toggle Theme
//       </MenuItemElement>
//     );
//   },
// );


// const submenu = menu.items.find((x) => x.name === 'window');

// if (!submenu) {
//   throw new Error('Expected submenu');
// }
// submenu.items.push(
//   new MenuItem({
//     name: 'toggleTheme',
//     render: () => <ToggleTheme theme={globalState.ui.theme} key='ThemeToggle' />,
//   }),
// );

menu.items.push(
  new SubMenu({
    name: 'about',
    title: 'About',
    items: [
      new MenuItem({
        name: 'docs',
        render: (rest) => (
          <MenuItemElement icon={<BookIcon />} {...rest}>
            <a
              href="https://docs.graph.tokens.studio/"
              target="_blank"
              rel="noreferrer"
            >
              Documentation
            </a>
          </MenuItemElement>
        ),
      }),
      new Seperator(),
      new MenuItem({
        name: 'youtube',
        render: (rest) => (
          <MenuItemElement icon={<YoutubeIcon />} {...rest}>
            <a
              href="https://www.youtube.com/@TokensStudio"
              target="_blank"
              rel="noreferrer"
            >
              Youtube
            </a>
          </MenuItemElement>
        ),
      }),
      new MenuItem({
        name: 'slack',
        render: (rest) => (
          <MenuItemElement icon={<SlackIcon />} {...rest}>
            <a
              href="https://tokens.studio//slack"
              target="_blank"
              rel="noreferrer"
            >
              Slack
            </a>
          </MenuItemElement>
        ),
      }),
    ],
  }),
);


export const panelItems = defaultPanelGroupsFactory();


panelItems.groups.push(new PanelGroup({
  title: 'Audio',
  key: 'audio',
  items:
    Object.values(audioLookup).map((node) => new PanelItem({
      type: node.type,
      icon: '??',
      text: node.title,
      description: node.description,
      docs: '',
    })),

}))


export const nodeTypes = {
  ...nodeLookup,
  ...audioLookup
}