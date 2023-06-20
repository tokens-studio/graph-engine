import {
  Box,
  Button,
  IconButton,
  Label,
  Link,
  PageHeader,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { Editor } from '#/editor/index.tsx';
import { LiveEditor, LiveError, LiveProvider } from 'react-live';
import { ReactFlowProvider } from 'reactflow';
import { Splitter } from '#/components/splitter.tsx';
import { code, scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useResizable } from 'react-resizable-layout';
import { useSelector } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';
import darkLogo from '../assets/svgs/tokensstudio-complete-dark.svg';
import logo from '../assets/svgs/tokensstudio-complete.svg';
import selectors from '#/redux/selectors/index.ts';
//@ts-ignore This is the correct import
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';
// @ts-ignore
import { themes } from 'prism-react-renderer';

import {
  CheckIcon,
  Cross1Icon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useOnEnter } from '#/hooks/onEnter.ts';
import { useTheme } from '#/hooks/useTheme.tsx';

const Preview = ({ style, codeRef }) => {
  const { position, separatorProps } = useResizable({
    axis: 'x',
    initial: 250,
    min: 100,
  });

  return (
    <Stack direction="row" style={style} css={{ background: '$bgSurface' }}>
      <Stack
        direction="row"
        style={{ flex: 1 }}
        css={{ background: '$bgSurface' }}
      >
        <Stack direction="column" style={{ width: position }}>
          <Box css={{ flexGrow: 1 }}>
            <ComponentPreview />
          </Box>
        </Stack>
        <Splitter direction="vertical" {...separatorProps} />
        <Stack direction="column" css={{ padding: '$4', flex: 1 }}>
          <Label>Editor</Label>
          <Box
            css={{
              fontSize: '$xsmall',
              fontFamily: 'monospace',
              overflow: 'auto',
              flex: 1,
            }}
          >
            <div ref={codeRef}>
              <LiveEditor />
            </div>
            <LiveError />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Wrapper = () => {
  const currentTab = useSelector(selectors.currentTab);
  const tabs = useSelector(selectors.tabs);
  // const reactFlowInstance = useReactFlow();
  const [theCode, setTheCode] = useState(code);
  const dispatch = useDispatch();
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
      const id = dispatch.ui.addTab(resolverName);
      //Create the new ref to attach
      setRefs((refs) => ({
        ...refs,
        [id]: React.createRef(),
      }));
      setResolverName('Untitled');
    }
    toggleCreating();
  };

  const removeTab = (ev) => {
    const id = ev.currentTarget.dataset.key;
    dispatch.ui.removeTab(id);
  };

  const onSave = useCallback(() => {
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
    refs[currentTab.id]?.current?.clear();
  }, [currentTab, refs]);
  const onLoad = useCallback(
    (e) => {
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

          if (code !== undefined) {
            setTheCode(code);
          }

          //Set the state
          dispatch.node.setState(state || {});

          current.load({
            ...rest,
          });
        };
        reader.readAsText(file);
      });

      // simulate a click on the input element to trigger the file picker dialog
      input.click();
    },
    [currentTab, dispatch.node, refs],
  );

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
        <Tabs.Content
          value={x.id}
          key={x.id}
          forceMount
          css={{
            height: '100%',
            position: 'absolute',
            width: '100%',
            top: 0,
            display: currentTab.id === x.id ? 'initial' : 'none',
          }}
        >
          <ReactFlowProvider>
            <Editor id={x.id} name={x.name} ref={ref} />
          </ReactFlowProvider>
        </Tabs.Content>
      );
    });
  }, [currentTab.id, refs, tabs]);

  const onEnter = useOnEnter(isCreating ? addTab : undefined);

  return (
    <LiveProvider
      code={theCode}
      scope={scope}
      theme={theme === 'light' ? themes.vsLight : themes.vsDark}
      noInline={true}
      enableTypeScript={true}
      language="jsx"
    >
      <div style={{ height: '100vh' }}>
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
                <Text size="small">
                  Mess around with the resolver prototype
                </Text>
                <Link href="https://docs.graph.tokens.studio/">
                  <Button size="small">Docs</Button>
                </Link>
              </Stack>
            </PageHeader.Description>
            <PageHeader.Actions>
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
            </PageHeader.Actions>
          </PageHeader>
          <Tabs
            value={currentTab.id}
            onValueChange={onTabChange}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              background: '$bgSurface',
            }}
          >
            <Tabs.List css={{ alignItems: 'center', background: '$bgSurface' }}>
              {tabs.map((x) => (
                <Stack direction="row" gap={2} align="center" key={x.id}>
                  <Tabs.Trigger css={{ fontSize: '$xsmall' }} value={x.id}>
                    {x.name}
                  </Tabs.Trigger>
                  <IconButton
                    icon={<Cross1Icon />}
                    variant="invisible"
                    size="small"
                    data-key={x.id}
                    onClick={removeTab}
                  ></IconButton>
                </Stack>
              ))}
              {isCreating ? (
                <Stack direction="row" gap={2}>
                  <TextInput
                    onKeyUp={onEnter}
                    value={resolverName}
                    onChange={(e) => setResolverName(e.target.value)}
                  />
                  <IconButton
                    onClick={addTab}
                    variant="invisible"
                    icon={<CheckIcon />}
                    size="small"
                  />
                </Stack>
              ) : (
                <IconButton
                  onClick={toggleCreating}
                  size="small"
                  icon={<PlusIcon />}
                  variant="invisible"
                />
              )}
            </Tabs.List>
            <div style={{ flex: 1, position: 'relative' }}>{tabContents}</div>
          </Tabs>
          <Splitter {...separatorProps} />
          <Preview codeRef={ref} style={{ height: position }} />
        </Stack>
      </div>
    </LiveProvider>
  );
};

export default Wrapper;
