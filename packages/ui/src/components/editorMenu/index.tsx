import {
  BookIcon,
  FloppyDiscIcon,
  FolderIcon,
  MoonIcon,
  SunIcon,
} from '@iconicicons/react';
import SlackIcon from '#/assets/svgs/slack.svg';
import YoutubeIcon from '#/assets/svgs/youtube.svg';
import { useCallback, useEffect } from 'react';
import { CodeEditorRef } from '#/service/refs.ts';
import { ResolverData } from '#/types/file.ts';
import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import Link from 'next/link';
import { store } from '#/redux/store.tsx';

export const Menubar = ({toggleTheme, theme}: {toggleTheme: () => void, theme: string}) => {

  const findCurrentEditor = useCallback(() => {
    // if (!dockRef) {
    //   return;
    // }

    // const graphs = dockRef.find('graphs') as PanelData;
    // if (!graphs) {
    //   return;
    // }

    // //Get the current activeID
    // const id = graphs.activeId;

    // if (!id) {
    //   return;
    // }
    const activeEditor = store.getState().refs['1']

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
      code: CodeEditorRef.current?.textContent,
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
  }, [findCurrentEditor]);

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
          // if (code !== undefined) {
          //     setTheCode(code);
          // }

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
  }, [findCurrentEditor]);

  return (
    <Stack direction="column" justify="between" gap={2} css={{flexGrow: 1}}>
      <Stack direction="column">
        <Box css={{ height: '1px', backgroundColor: '$borderSubtle', margin: '$2'}} />
        <IconButton tooltip="Load .json" variant="invisible" size="medium" icon={<FolderIcon />} onClick={onLoad} />
        <IconButton tooltip="Save as .json" variant="invisible" size="medium" icon={<FloppyDiscIcon />} onClick={onSave} />
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
          as={Link}
          href="https://docs.graph.tokens.studio/"
          variant="invisible"
          tooltip="View documentation"
          size="medium"
          icon={<BookIcon />}
          onClick={toggleTheme}
        />
        <IconButton
          as={Link}
          href="https://www.youtube.com/@TokensStudio"
          variant="invisible"
          tooltip="YouTube"
          size="medium"
          icon={<YoutubeIcon />}
        />
        <IconButton
          as={Link}
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
