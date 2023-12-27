import {
  BookIcon,
  FilePlusIcon,
  FloppyDiscIcon,
  FolderIcon,
  MoonIcon,
  PhotoIcon,
  SunIcon,
} from '@iconicicons/react';
import SlackIcon from '@/assets/svgs/slack.svg';
import YoutubeIcon from '@/assets/svgs/youtube.svg';
import { useCallback, useState } from 'react';
import { ResolverData } from '@/types/file.ts';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import { Box, IconButton, Stack } from '@tokens-studio/ui';
import { toPng } from 'html-to-image';
import { store } from '@/redux/store.tsx';

import { showNodesPanelSelector } from '@/redux/selectors/index.ts';
import { useSelector } from 'react-redux';
import { useDispatch } from '@/hooks/useDispatch.ts';

const imageWidth = 1024;
const imageHeight = 768;

export const Menubar = ({
  toggleTheme,
  theme,
  onLoadExamples,
  previewCode,
  setPreviewCode,
}: {
  toggleTheme: () => void;
  theme: string;
  onLoadExamples: () => void;
  previewCode: string;
  setPreviewCode: (code: string) => void;
}) => {
  const showNodesPanel = useSelector(showNodesPanelSelector);
  const dispatch = useDispatch();

  const findCurrentEditor = useCallback(() => {
    const activeEditor = store.getState().refs.editor;

    return activeEditor;
  }, []);

  // TODO: Move all of this to a hook
  const onPrint = useCallback(async () => {
    function downloadImage(dataUrl) {
      const a = document.createElement('a');
      a.setAttribute('download', 'reactflow.png');
      a.setAttribute('href', dataUrl);
      a.click();
    }

    const editor = findCurrentEditor();
    if (!editor) {
      return;
    }

    const reactFlow = editor.current.getFlow();

    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(reactFlow.getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0,
      Infinity,
    );

    toPng(
      document.querySelector(`.editor .react-flow__viewport`) as HTMLElement,
      {
        backgroundColor: '#1a365d',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: '' + imageWidth,
          height: '' + imageHeight,
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      },
    ).then(downloadImage);
  }, [findCurrentEditor]);

  return (
    <Stack
      id="toolbar"
      direction="column"
      justify="between"
      gap={2}
      css={{ flexGrow: 1 }}
    >
      <Stack direction="column" justify="end" css={{ flexGrow: 1 }}>
        <IconButton
          variant="invisible"
          tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'}
          size="medium"
          icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleTheme}
        />
        <IconButton
          variant="invisible"
          tooltip="Save as screenshot"
          size="medium"
          icon={<PhotoIcon />}
          onClick={onPrint}
        />
        <IconButton
          id="more-help"
          // @ts-ignore
          as="a"
          href="https://docs.graph.tokens.studio/"
          variant="invisible"
          tooltip="View documentation"
          size="medium"
          icon={<BookIcon />}
        />
        <IconButton
          // @ts-ignore
          as="a"
          href="https://www.youtube.com/@TokensStudio"
          variant="invisible"
          tooltip="YouTube"
          size="medium"
          icon={<YoutubeIcon />}
        />
        <IconButton
          // @ts-ignore
          as="a"
          href="https://tokens.studio//slack"
          variant="invisible"
          tooltip="Slack"
          size="medium"
          icon={<SlackIcon />}
        />
      </Stack>
    </Stack>
  );
};
