import { useDispatch } from '@/hooks/useDispatch.ts';
import { BookIcon, MoonIcon, SunIcon } from '@iconicicons/react';
import {
  Seperator,
  MenuItemElement,
  defaultMenuDataFactory,
  MenuItem,
  SubMenu,
} from '@tokens-studio/graph-editor';
import React, { useCallback } from 'react';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';
import YoutubeIcon from '@/assets/svgs/youtube.svg';
import SlackIcon from '@/assets/svgs/slack.svg';
import { Link } from '@tokens-studio/ui';

export const menu = defaultMenuDataFactory();

const submenu = menu.items.find((x) => x.name === 'window');

if (!submenu) {
  throw new Error('Expected submenu');
}
submenu.items.push(
  new MenuItem({
    name: 'toggleTheme',
    render: () => <ToggleTheme theme={globalState.ui.theme} />,
  }),
);

menu.items.push(
  new SubMenu({
    name: 'about',
    title: 'About',
    items: [
      new MenuItem({
        name: 'docs',
        render: () => (
          <MenuItemElement icon={<BookIcon />}>
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
        render: () => (
          <MenuItemElement icon={<YoutubeIcon />}>
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
        render: () => (
          <MenuItemElement icon={<SlackIcon />}>
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

//           href=""
//           variant="invisible"
//           tooltip="View documentation"
//           size="medium"
//           icon={<BookIcon />}

// <IconButton
//   // @ts-ignore
//   as="a"
//   href="https://www.youtube.com/@TokensStudio"
//   variant="invisible"
//   tooltip="YouTube"
//   size="medium"
//   icon={}
// />

const ToggleTheme = observer(
  ({ theme }: { theme: GlobalState['ui']['theme'] }) => {
    const theTheme = theme.get();
    const toggleTheme = useCallback(() => {
      globalState.ui.theme.set(theTheme === 'light' ? 'dark' : 'light');
    }, [theTheme]);

    return (
      <MenuItemElement
        onClick={toggleTheme}
        icon={theTheme === 'light' ? <MoonIcon /> : <SunIcon />}
      >
        Toggle Theme
      </MenuItemElement>
    );
  },
);

// const imageWidth = 1024;
// const imageHeight = 768;

// export const Menubar = ({
//   toggleTheme,
//   theme,
//   onLoadExamples,
//   previewCode,
//   setPreviewCode,
// }: {
//   toggleTheme: () => void;
//   theme: string;
//   onLoadExamples: () => void;
//   previewCode: string;
//   setPreviewCode: (code: string) => void;
// }) => {
//   const showNodesPanel = useSelector(showNodesPanelSelector);
//   const dispatch = useDispatch();

//   const findCurrentEditor = useCallback(() => {
//     const activeEditor = store.getState().refs.editor;

//     return activeEditor;
//   }, []);

//   // TODO: Move all of this to a hook
//   const onPrint = useCallback(async () => {
//     function downloadImage(dataUrl) {
//       const a = document.createElement('a');
//       a.setAttribute('download', 'reactflow.png');
//       a.setAttribute('href', dataUrl);
//       a.click();
//     }

//     const editor = findCurrentEditor();
//     if (!editor) {
//       return;
//     }

//     const reactFlow = editor.current.getFlow();

//     // we calculate a transform for the nodes so that all nodes are visible
//     // we then overwrite the transform of the `.react-flow__viewport` element
//     // with the style option of the html-to-image library
//     const nodesBounds = getRectOfNodes(reactFlow.getNodes());
//     const transform = getTransformForBounds(
//       nodesBounds,
//       imageWidth,
//       imageHeight,
//       0,
//       Infinity,
//     );

//     toPng(
//       document.querySelector(`.editor .react-flow__viewport`) as HTMLElement,
//       {
//         backgroundColor: '#1a365d',
//         width: imageWidth,
//         height: imageHeight,
//         style: {
//           width: '' + imageWidth,
//           height: '' + imageHeight,
//           transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
//         },
//       },
//     ).then(downloadImage);
//   }, [findCurrentEditor]);

//   return (
//     <Stack
//       id="toolbar"
//       direction="column"
//       justify="between"
//       gap={2}
//       css={{ flexGrow: 1 }}
//     >
//       <Stack direction="column" justify="end" css={{ flexGrow: 1 }}>
//         <IconButton
//           variant="invisible"
//           tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'}
//           size="medium"
//           icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
//           onClick={toggleTheme}
//         />
//         <IconButton
//           variant="invisible"
//           tooltip="Save as screenshot"
//           size="medium"
//           icon={<PhotoIcon />}
//           onClick={onPrint}
//         />
//         <IconButton
//           id="more-help"
//           // @ts-ignore
//           as="a"
//           href="https://docs.graph.tokens.studio/"
//           variant="invisible"
//           tooltip="View documentation"
//           size="medium"
//           icon={<BookIcon />}
//         />

//         <IconButton
//           // @ts-ignore
//           as="a"
//           href="https://tokens.studio//slack"
//           variant="invisible"
//           tooltip="Slack"
//           size="medium"
//           icon={<SlackIcon />}
//         />
//       </Stack>
//     </Stack>
//   );
// };
