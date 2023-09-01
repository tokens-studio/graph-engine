import {
  Box,
  Button,
  DropdownMenu,
  IconButton,
  Link,
  NavList,
  PageHeader,
  Stack,
  Tabs,
  Text,
  TextInput,
  ToggleGroup,
} from '@tokens-studio/ui';

import {
  Editor,
  ImperativeEditorRef,
  EditorEdge,
  EditorNode,
} from '@tokens-studio/graph-editor';
import { LiveProvider } from 'react-live';
import { Splitter } from '#/components/splitter.tsx';
import { code, scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useResizable } from 'react-resizable-layout';
import { useSelector } from 'react-redux';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import darkLogo from '../assets/svgs/tokensstudio-complete-dark.svg';
import logo from '../assets/svgs/tokensstudio-complete.svg';
import {
  showJourneySelector,
  tabs as tabsSelector,
  currentTab as currentTabSelector,
} from '#/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { themes } from 'prism-react-renderer';

//import the example
import example from '#/examples/card.json';

import {
  CheckIcon,
  Cross1Icon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useOnEnter } from '#/hooks/onEnter.ts';
import { useTheme } from '#/hooks/useTheme.tsx';
import { useJourney } from '#/journeys/basic.tsx';
import { JoyrideTooltip } from '#/components/joyride/tooltip.tsx';
import { Preview } from '#/components/Preview.tsx';
import { DotsHorizontalIcon, FloppyDiscIcon, FolderIcon, TrashIcon } from '@iconicicons/react';

interface ResolverData {
  nodes: EditorNode[];
  edges: EditorEdge[];
  state: Record<string, any>;
  code: string;
}

const Wrapper = () => {
  const currentTab = useSelector(currentTabSelector);
  const tabs = useSelector(tabsSelector);

  const [theCode, setTheCode] = useState(code);
  const [loadedExample, setLoadedExample] = useState(false);
  const dispatch = useDispatch();
  const showJourney = useSelector(showJourneySelector);
  const theme = useTheme();
  const initRefs = useCallback(() => {
    return tabs.reduce((acc, x) => {
      acc[x.id] = React.createRef();
      return acc;
    }, {});
  }, []);
  const [refs, setRefs] =
    useState<Record<string, MutableRefObject<ImperativeEditorRef>>>(initRefs);

  const ref = React.useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = useCallback(
    () => setIsCreating(!isCreating),
    [isCreating, setIsCreating],
  );

  const { position, separatorProps } = useResizable({
    axis: 'y',
    initial: 250,
    min: 50,
    reverse: true,
  });

  const [resolverName, setResolverName] = useState('Untitled');

  const onTabChange = (name: string) => {
    dispatch.ui.setSelectedTab(name);
  };

  const addTab = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!tabs.find((x) => x.name === resolverName)) {
      const id = uuidv4();
      dispatch.ui.addTab({ name: resolverName, id });

      //Create the new ref to attach
      setRefs((refs) => ({
        ...refs,
        [id]: React.createRef(),
      }));
      //Reset the resolver name
      setResolverName('Untitled');
    }
    toggleCreating();
  };

  const removeTab = (ev) => {
    const id = ev.currentTarget.dataset.key;
    dispatch.ui.removeTab(id);
  };

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
  }, [currentTab, dispatch.node, refs]);

  const onClear = useCallback(() => {
    if (currentTab) {
      refs[currentTab.id]?.current?.clear();

      dispatch.editorOutput.set({
        name: currentTab.name,
        value: undefined,
      });
    }
  }, [currentTab, refs]);

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
  }, [currentTab, dispatch.node, refs]);

  useEffect(() => {
    if (!loadedExample) {
      const exampleData = example as ResolverData;

      const { state, code, edges, nodes } = exampleData;
      const current = refs[currentTab.id]?.current;

      if (code !== undefined) {
        setTheCode(code);
      }

      current.load({
        nodes: nodes,
        edges: edges,
        nodeState: state,
      });
      setLoadedExample(true);
    }
  }, [refs]);

  const onEditorOutputChange = (output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: currentTab.name,
      value: output,
    });
  };

  const onForceUpdate = useCallback(() => {
    const current = refs[currentTab.id]?.current;
    if (!current) {
      alert('No attached tab found');
      return;
    }
    current.forceUpdate();
  }, [currentTab, refs]);

  const tabContents = useMemo(() => {
    return tabs.map((x) => {
      const ref = refs[x.id];

      return (
        <Box
          value={x.id}
          key={x.id}
          forceMount
          css={{
            height: '100%',
            position: 'absolute',
            width: '100%',
            background: '$bgSurface',
            top: 0,
            display: currentTab?.id === x.id ? 'initial' : 'none',
          }}
        >
          <Editor id={x.id} name={x.name} ref={ref} onOutputChange={onEditorOutputChange} />
        </Box>
      );
    });
  }, [currentTab?.id, refs, tabs, onEditorOutputChange]);

  const onEnter = useOnEnter(isCreating ? addTab : undefined);

  const [{ steps }] = useJourney();
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      dispatch.journey.setShowJourney(false);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={showJourney}
        tooltipComponent={JoyrideTooltip}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Stack
          direction="column"
          css={{ height: '100%', background: '$bgSurface' }}
        >
          <Box css={{position: 'fixed', top: '$3', left: '$3', zIndex: 1}}>
           
          </Box>
          <Box css={{position: 'fixed', top: '$3', right: '$3', zIndex: 1}}>
            <LiveProvider
              code={theCode}
              scope={scope}
              theme={theme === 'light' ? themes.vsLight : themes.vsDark}
              noInline={true}
              enableTypeScript={true}
              language="jsx"
            >
              <Preview
                id="code-editor"
                codeRef={ref}
                style={{ height: position }}
              />
            </LiveProvider>
          </Box>
          <Stack direction="row" gap={1} css={{position: 'fixed', top: '$3', left: '$3', zIndex: 1}}>
          {theme === 'light' && (
              <img src={logo.src} style={{ height: '2em' }} />
            )}
            {theme !== 'light' && (
              <img src={darkLogo.src} style={{ height: '2em' }} />
            )}
            <IconButton onClick={onLoad} icon={<FolderIcon />}  title="Load .json" variant="invisible" />
            <IconButton onClick={onSave} icon={<FloppyDiscIcon />}  title="Save .json" variant="invisible" />
            <IconButton
              icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
              variant="invisible"
              onClick={() => dispatch.ui.toggleTheme(null)}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            />
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton icon={<DotsHorizontalIcon />} variant="invisible" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={onForceUpdate}>Force update</DropdownMenu.Item>
                <DropdownMenu.Item onClick={onClear}>Clear canvas</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Stack>
          <Box
            value={currentTab?.id}
            onValueChange={onTabChange}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              background: '$bgSurface',
            }}
          >
            <div style={{ flex: 1, position: 'relative' }}>{tabContents}</div>
          </Box>
        </Stack>
      </div>
    </>
  );
};

export default Wrapper;
