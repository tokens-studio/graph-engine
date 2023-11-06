import { useTheme } from '#/hooks/useTheme.tsx';
import { Button, Dialog, PageHeader, Stack, Text } from '@tokens-studio/ui';
import DarkLogo from '#/assets/svgs/tokensstudio-complete-dark.svg';
import LightLogo from '#/assets/svgs/tokensstudio-complete.svg';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useDispatch } from '#/hooks/index.ts';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  tabs as tabsSelector,
  currentTab as currentTabSelector,
} from '#/redux/selectors/index.ts';
import { useEditorRefs } from '#/providers/editorRefs.tsx';
import { ResolverData } from '#/types/resolverData.ts';
import { useCode } from '#/providers/code.tsx';
import { Settings } from '../Settings.tsx';

export const Header = () => {
  const theme = useTheme();
  const currentTab = useSelector(currentTabSelector);
  const dispatch = useDispatch();
  const { refs } = useEditorRefs();
  const { ref, code, setCode } = useCode();

  const onClear = useCallback(() => {
    if (currentTab) {
      refs[currentTab.id]?.current?.clear();

      dispatch.editorOutput.set({
        name: currentTab.name,
        value: undefined,
      });
    }
  }, [currentTab, dispatch.editorOutput, refs]);

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
              setCode(code);
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
  }, [currentTab, onClear, refs, setCode]);

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
      code: ref?.current?.textContent,
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
  }, [ref, code, currentTab, refs]);

  const onForceUpdate = useCallback(() => {
    const current = refs[currentTab.id]?.current;
    if (!current) {
      alert('No attached tab found');
      return;
    }
    current.forceUpdate();
  }, [currentTab, refs]);

  return (
    <PageHeader>
      <PageHeader.LeadingVisual>
        {theme === 'light' && <LightLogo height={32} />}
        {theme !== 'light' && <DarkLogo height={32} />}
      </PageHeader.LeadingVisual>
      <PageHeader.Title>Resolver Playground</PageHeader.Title>
      <PageHeader.Description>
        <Stack direction="row" gap={4} align="center">
          <Text size="small">Mess around with the resolver prototype</Text>
        </Stack>
      </PageHeader.Description>
      {/* @ts-ignore */}
      <PageHeader.Actions id="toolbar">
        <Button
          icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
          variant="invisible"
          size="small"
          onClick={() => dispatch.ui.toggleTheme(null)}
        ></Button>
        <Button onClick={onForceUpdate}>Force Update</Button>
        <Button onClick={onClear}>Clear</Button>
        <Button onClick={onSave}>Save</Button>
        <Button onClick={onLoad}>Load</Button>
        <Settings />
      </PageHeader.Actions>
    </PageHeader>
  );
};
