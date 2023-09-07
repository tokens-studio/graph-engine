import {
  Box,
  Stack,
} from '@tokens-studio/ui';

import {
  Editor,
  ImperativeEditorRef,
  EditorEdge,
  EditorNode,
} from '@tokens-studio/graph-editor';
import { LiveProvider } from 'react-live';
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
import example from '#/examples/scale.json';

import { useOnEnter } from '#/hooks/onEnter.ts';
import { useTheme } from '#/hooks/useTheme.tsx';
import { useJourney } from '#/journeys/basic.tsx';
import { JoyrideTooltip } from '#/components/joyride/tooltip.tsx';
import { Preview } from '#/components/Preview.tsx';
import { TrashIcon } from '@iconicicons/react';
import { Toolbar } from '../components/Toolbar.tsx';
import { TokensStudioLogo } from '#/components/TokensStudioLogo.tsx';

export interface ResolverData {
  nodes: EditorNode[];
  edges: EditorEdge[];
  state: Record<string, any>;
  code: string;
}

const Wrapper = () => {
  const currentTab = useSelector(currentTabSelector);
  const tabs = useSelector(tabsSelector);
  const [theCode, setTheCode] = useState(code);
  const [loadedExample, setLoadedExample] = useState<string>();
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


  useEffect(() => {
    console.log("Changed", currentTab, loadedExample, example);
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
      console.log("loaded", {
        nodes: nodes,
        edges: edges,
        nodeState: state,
      })
      setLoadedExample('initial');
    }
  }, [refs, loadedExample, currentTab]);

  const onEditorOutputChange = useCallback((output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: currentTab.name,
      value: output,
    });
  }, [currentTab]);

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
            backgroundColor: '$bgCanvas',
            top: 0,
            display: currentTab?.id === x.id ? 'initial' : 'none',
          }}
        >
          <Editor id={x.id} name={x.name} ref={ref} onOutputChange={onEditorOutputChange} loadedExample={loadedExample} />
        </Box>
      );
    });
  }, [currentTab?.id, refs, tabs, onEditorOutputChange, loadedExample]);

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
          css={{ height: '100%', background: '$bgCanvas' }}
        >
          <Box css={{ position: 'fixed', top: '$3', left: '$3', zIndex: 1 }}>
            <TokensStudioLogo style={{ height: '3rem', width: 'auto' }} />
          </Box>
          <Toolbar codeRef={ref} refs={refs} setTheCode={setTheCode} />
          <Box
            value={currentTab?.id}
            onValueChange={onTabChange}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              background: '$bgCanvas',
              position: 'relative',
            }}
          >
            <div style={{ flex: 1, position: 'relative' }}>{tabContents}</div>
          </Box>
          <Box css={{ position: 'fixed', top: '$3', right: '$3' }}>
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
        </Stack>
      </div>
    </>
  );
};

export default Wrapper;
