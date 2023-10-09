import {
  BookIcon,
  FilePlusIcon,
  FloppyDiscIcon,
  FolderIcon,
  MoonIcon,
  PhotoIcon,
  SunIcon,
} from '@iconicicons/react';
import SlackIcon from '#/assets/svgs/slack.svg';
import YoutubeIcon from '#/assets/svgs/youtube.svg';
import { useCallback } from 'react';
import { ResolverData } from '#/types/file.ts';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import { Box, IconButton, Stack } from '@tokens-studio/ui';
import { toPng } from 'html-to-image';
import { store } from '#/redux/store.tsx';
import { usePreviewContext } from '#/providers/preview.tsx';

const imageWidth = 1024;
const imageHeight = 768;

export const Menubar = ({
  toggleTheme,
  theme,
  onLoadExamples
}: {
  toggleTheme: () => void;
  theme: string;
  onLoadExamples: () => void;
}) => {
  const { setCode, code } = usePreviewContext();
  const findCurrentEditor = useCallback(() => {
    const activeEditor = store.getState().refs.editor;

    return activeEditor;
  }, []);

  const onSave = useCallback(() => {
    const editor = findCurrentEditor();

    if (!editor) {
      return;
    }
    const { nodes, nodeState, ...rest } = editor.current.save();

    const finalState = nodes.reduce((acc, node) => {
      acc[node.id] = nodeState[node.id];
      return acc;
    }, {});

    const fileContent = JSON.stringify({
      nodes,
      ...rest,
      state: finalState,
      code,
    });

    const blob = new Blob([fileContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tokens-studio-export.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, [code, findCurrentEditor]);

  const onLoad = useCallback(() => {
    const editor = findCurrentEditor();
    if (!editor) {
      return;
    }
    // create an input element
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', function (event) {
      //@ts-ignore
      const files = event?.target?.files;
      const file = files[0];

      // do something with the file, like reading its contents
      const reader = new FileReader();
      reader.onload = function () {
        const resolver = JSON.parse(reader.result as string) as ResolverData;

        const { state, code, nodes, edges } = resolver;
        //TODO , this needs a refactor. We need to wait for the clear to finish
        // as the nodes still get one final update by the dispatch before they are removed which
        // causes nulls to occur everywhere. They need to be unmounted
        setTimeout(() => {
          if (code !== undefined) {
            setCode(code);
          }

          editor.current.load({
            nodes,
            edges,
            nodeState: state,
          });
        }, 0);
      };
      reader.readAsText(file);
    });

    // simulate a click on the input element to trigger the file picker dialog
    input.click();
  }, [findCurrentEditor, setCode]);

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
      <Stack direction="column">
        <Box
          css={{
            height: '1px',
            backgroundColor: '$borderSubtle',
            margin: '$2',
          }}
        />
        <IconButton
          tooltip="Load .json"
          variant="invisible"
          size="medium"
          icon={<FolderIcon />}
          onClick={onLoad}
        />
        <IconButton
          tooltip="Save as .json"
          variant="invisible"
          size="medium"
          icon={<FloppyDiscIcon />}
          onClick={onSave}
        />
        <IconButton
          tooltip="Load example"
          variant="invisible"
          size="medium"
          icon={<FilePlusIcon />}
          onClick={onLoadExamples}
        />
      </Stack>
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
