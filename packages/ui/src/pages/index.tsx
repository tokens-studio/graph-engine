import {
  Box,
  Button,
  Dialog,
  DropdownMenu,
  IconButton,
  Label,
  Link,
  NavList,
  PageHeader,
  Stack,
  Tabs,
  Text,
  TextInput,
  ToggleGroup,
} from '@tokens-studio/ui';
import { Editor } from '#/editor/index.tsx';
import { LiveEditor, LiveError, LiveProvider } from 'react-live';
import { ReactFlowProvider } from 'reactflow';
import { Splitter } from '#/components/splitter.tsx';
import { code, scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useResizable } from 'react-resizable-layout';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import darkLogo from '../assets/svgs/tokensstudio-complete-dark.svg';
import logo from '../assets/svgs/tokensstudio-complete.svg';
import {
  showJourneySelector,
  tabs as tabsSelector,
  currentTab as currentTabSelector,
} from '#/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { v4 as uuidv4 } from 'uuid';
//@ts-ignore This is the correct import
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';
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
import { Settings } from '#/components/settings/index.tsx';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, VideoIcon } from '@iconicicons/react';

const Preview = ({ style, codeRef, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTab, setVisibleTab] = useState("preview");

  const { position, separatorProps } = useResizable({
    axis: 'x',
    initial: 250,
    min: 100,
  });

  const handleToggleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  return (
      <Box
        css={{ position: 'absolute', bottom: '$4', left: '$4', }}
        {...rest}
      >
        <Box css={{display: 'flex', flexDirection: 'column', maxHeight: '40vh', maxWidth: '40vw', backgroundColor: '$bgSurface', borderRadius: '$medium', border: '1px solid', boxShadow: '$small', borderColor: '$borderMuted', padding: isVisible ? '$3' : 0}}>
          <Stack direction="row" justify="between" align="center">
            <Button onClick={handleToggleVisible} icon={isVisible ? <ChevronDownIcon /> : <ChevronUpIcon />} variant="invisible">
              Preview
            </Button>
            {isVisible && <ToggleGroup type="single" value={visibleTab} onValueChange={setVisibleTab}>
              <ToggleGroup.Item value="preview"><VideoIcon /></ToggleGroup.Item>
              <ToggleGroup.Item value="editor"><CodeIcon /></ToggleGroup.Item>
            </ToggleGroup>}
          </Stack>
          {isVisible &&
          <Box css={{overflowY: 'scroll', flexGrow: 1}}>
            {visibleTab === "preview" && <Box css={{width: '100%', display: 'flex'}}><ComponentPreview /></Box>}
            {visibleTab === "editor" && <Box
              css={{
                fontSize: '$xsmall',
                fontFamily: 'monospace',
                overflowY: 'scroll',
                maxHeight: '100%',
                flex: 1,
              }}
            >
              <div ref={codeRef}>
                <LiveEditor />
              </div>
              <LiveError />
            </Box>}
            </Box>}
        </Box>
    </Box>
  );
};

const Wrapper = () => {
  const currentTab = useSelector(currentTabSelector);
  const tabs = useSelector(tabsSelector);
  // const reactFlowInstance = useReactFlow();
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
  const [refs, setRefs] = useState(initRefs);

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

    const { nodes, edges } = current.save();
    const state = dispatch.node.getState();

    const finalState = nodes.reduce((acc, node) => {
      acc[node.id] = state[node.id];
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
    }
  }, [currentTab, refs]);
  const onLoad = useCallback(
    (e) => {
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
            const resolver = JSON.parse(reader.result as string);

            const { state, code, ...rest } = resolver;

            onClear();
            //TODO , this needs a refactor. We need to wait for the clear to finish
            // as the nodes still get one final update by the dispatch before they are removed which
            // causes nulls to occur everywhere. They need to be unmounted
            setTimeout(() => {
              if (code !== undefined) {
                setTheCode(code);
              }
              dispatch.node.setState(state || {});
              current.load({
                ...rest,
              });
            }, 0);
          };
          reader.readAsText(file);
        });

        // simulate a click on the input element to trigger the file picker dialog
        input.click();
      }
    },
    [currentTab, dispatch.node, refs],
  );

  useEffect(() => {
    if (!loadedExample) {
      const { state, code, ...rest } = example;
      const current = refs[currentTab.id]?.current;

      if (code !== undefined) {
        setTheCode(code);
      }

      //Set the state
      dispatch.node.setState(state || {});

      current.load({
        ...rest,
      });
      setLoadedExample(true);
    }
  }, [refs]);

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
            top: 0,
            display: currentTab?.id === x.id ? 'initial' : 'none',
          }}
        >
          <ReactFlowProvider>
            <Editor id={x.id} name={x.name} ref={ref} />
          </ReactFlowProvider>
        </Box>
      );
    });
  }, [currentTab?.id, refs, tabs]);

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
          <PageHeader>
            <PageHeader.LeadingVisual>
              {theme === 'light' && (
                <img src={logo.src} style={{ height: '2em' }} />
              )}
              {theme !== 'light' && (
                <img src={darkLogo.src} style={{ height: '2em' }} />
              )}
            </PageHeader.LeadingVisual>
            <PageHeader.Title>Resolver Playground</PageHeader.Title>
            <PageHeader.Description>
              <Stack direction="row" gap={4} align="center">
                {/* @ts-ignore */}
                <Button id="more-help" as={Link} target="_blank" href="https://docs.graph.tokens.studio/" size="small">Docs</Button>
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
        </Stack>
      </div>
    </>
  );
};

export default Wrapper;
