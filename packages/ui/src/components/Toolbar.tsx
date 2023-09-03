import {
  Box,
  DropdownMenu,
  IconButton,
  Stack
} from '@tokens-studio/ui';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';
import { useDispatch } from '#/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, {
  MutableRefObject,
  useCallback
} from 'react';
import {
  tabs as tabsSelector,
  currentTab as currentTabSelector
} from '#/redux/selectors/index.ts';

import { useTheme } from '#/hooks/useTheme.tsx';
import { MoonIcon, SunIcon, DotsHorizontalIcon, FloppyDiscIcon, FolderIcon } from '@iconicicons/react';
import { ResolverData } from '../pages/index.tsx';


export function Toolbar({ refs, ref, setTheCode }: { refs: Record<string, MutableRefObject<ImperativeEditorRef>>; ref: HTMLDivElement; setTheCode: (code: string) => void; }) {
  const currentTab = useSelector(currentTabSelector);
  const tabs = useSelector(tabsSelector);
  const dispatch = useDispatch();
  const theme = useTheme();

  const onSave = useCallback(() => {
    if (!currentTab) {
      return;
    }
    const current = refs[currentTab.id]?.current;
    if (!current) {
      alert('No attached tab found');
      return;
    }

    const { nodes, edges, nodeState } = current.save();

    const finalState = nodes.reduce((acc, node) => {
      acc[node.id] = nodeState[node.id];
      return acc;
    }, {});

    const fileContent = JSON.stringify({
      nodes,
      edges,
      state: finalState,
      code: ref.current?.textContent,
    });

    const blob = new Blob([fileContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTab.name}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, [currentTab, refs, ref]);

  const onClear = useCallback(() => {
    if (currentTab) {
      refs[currentTab.id]?.current?.clear();

      dispatch.editorOutput.set({
        name: currentTab.name,
        value: undefined,
      });
    }
  }, [currentTab, refs, dispatch.editorOutput]);

  const onLoad = useCallback(() => {
    if (currentTab) {
      const current = refs[currentTab.id]?.current;
      if (!current) {
        alert('No attached tab found');
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

          onClear();
          //TODO , this needs a refactor. We need to wait for the clear to finish
          // as the nodes still get one final update by the dispatch before they are removed which
          // causes nulls to occur everywhere. They need to be unmounted
          setTimeout(() => {
            if (code !== undefined) {
              setTheCode(code);
            }

            current.load({
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
    }
  }, [currentTab, refs, onClear]);

  const onForceUpdate = useCallback(() => {
    const current = refs[currentTab.id]?.current;
    if (!current) {
      alert('No attached tab found');
      return;
    }
    current.forceUpdate();
  }, [currentTab, refs]);

  return (<Box css={{ position: 'fixed', top: '$9', left: '$3', zIndex: 1, pointerEvents: 'none', backgroundColor: '$bgDefault', padding: '$2', borderRadius: '$medium', border: '1px solid $borderSubtle', boxShadow: '$small' }}>
    <Stack direction="column" justify="start" align="start" gap={1} css={{ pointerEvents: 'auto' }} >
      <IconButton onClick={onLoad} icon={<FolderIcon />} tooltip="Load .json" variant="invisible" />
      <IconButton onClick={onSave} icon={<FloppyDiscIcon />} tooltip="Save as .json" variant="invisible" />
      <IconButton
        icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
        variant="invisible"
        onClick={() => dispatch.ui.toggleTheme(null)}
        tooltip={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} />
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton icon={<DotsHorizontalIcon />} variant="invisible" tooltip="More options" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={onForceUpdate}>Force update</DropdownMenu.Item>
          <DropdownMenu.Item onClick={onClear}>Clear canvas</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Stack>
  </Box>
  );
}
