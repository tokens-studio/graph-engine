import { IconButton, Stack, Text } from '@tokens-studio/ui';
import { DockLayout, LayoutData, TabGroup } from 'rc-dock';
import { Editor, DropPanel } from '@tokens-studio/graph-editor';
import { LiveProvider } from 'react-live';
import { code, scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  showJourneySelector,
  tabs as tabsSelector,
  currentTab as currentTabSelector,
} from '#/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
// @ts-ignore
import { themes } from 'prism-react-renderer';

//import the example
import example from '#/examples/card.json';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useTheme } from '#/hooks/useTheme.tsx';
import { useJourney } from '#/journeys/basic.tsx';
import { JoyrideTooltip } from '#/components/joyride/tooltip.tsx';
import { CodeEditor, Preview } from '#/components/Preview.tsx';
import {
  ArrowUpRightIcon,
  GridMasonryIcon,
  MaximizeIcon,
  MinimizeIcon,
} from '@iconicicons/react';
import { Menubar } from '#/components/editorMenu/index.tsx';
import { EditorRefs } from '#/service/refs.ts';
import { useRegisterRef } from '#/hooks/ref.ts';

const DockButton = (rest) => {
  return (
    <IconButton
      size="small"
      variant="invisible"
      css={{ padding: '$2' }}
      {...rest}
    />
  );
};

let groups: Record<string, TabGroup> = {
  popout: {
    animated: false,
    floatable: true,
    panelExtra: (panelData, context) => {
      let buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <MinimizeIcon /> : <MaximizeIcon />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
        buttons.push(
          <DockButton
            key="new-window"
            title="Open in new window"
            icon={<ArrowUpRightIcon />}
            onClick={() => context.dockMove(panelData, null, 'new-window')}
          ></DockButton>,
        );
      }
      buttons.push(
        <DockButton
          key="close"
          title="Close"
          icon={<Cross1Icon />}
          onClick={() => context.dockMove(panelData, null, 'remove')}
        ></DockButton>,
      );
      return <Stack gap={2}>{buttons}</Stack>;
    },
  },
  /**
   * Note that the graph has a huge issue when ran in a popout window, as such we disable it for now
   */
  graph: {
    animated: false,
    floatable: true,
    panelExtra: (panelData, context) => {
      let buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <MinimizeIcon /> : <MaximizeIcon />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
      }

      return <Stack gap={2}>{buttons}</Stack>;
    },
  },
};

const Wrapper = () => {
  const currentTab = useSelector(currentTabSelector);

  const [theCode, setTheCode] = useState(code);
  const [loadedExample, setLoadedExample] = useState(false);
  const dispatch = useDispatch();
  const showJourney = useSelector(showJourneySelector);
  const theme = useTheme();
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const [, setDockRef] = useRegisterRef<DockLayout>('dock');

  const defaultLayout: LayoutData = {
    dockbox: {
      mode: 'vertical',
      children: [
        {
          mode: 'horizontal',
          children: [
            {
              size: 300,
              tabs: [
                {
                  group: 'popout',
                  id: 'tab2',
                  title: 'Nodes',
                  content: <DropPanel id="drop-panel" />,
                },
              ],
            },
            {
              id: 'graphs',
              size: 1000,
              group: 'graph',

              panelLock: { panelStyle: 'graph' },
              tabs: [],
            },
          ],
        },
        {
          mode: 'horizontal',
          children: [
            {
              tabs: [
                {
                  group: 'popout',
                  id: 'tab3',
                  title: 'Preview',
                  content: <Preview />,
                },
              ],
            },
            {
              tabs: [
                {
                  group: 'popout',
                  id: 'tab4',
                  title: 'Code Editor',
                  content: (
                    <CodeEditor
                      id="code-editor"
                      style={{ height: '100%', width: '100%' }}
                      codeRef={setCodeRef}
                    />
                  ),
                },
              ],
            },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    if (!loadedExample) {
      const exampleData = example as ResolverData;

      const { state, code, edges, nodes } = exampleData;

      const editor = EditorRefs[currentTab.id];

      if (!editor.current) {
        return;
      }

      if (code !== undefined) {
        setTheCode(code);
      }

      editor.current.load({
        nodes: nodes,
        edges: edges,
        nodeState: state,
      });
      setLoadedExample(true);
    }
  }, [currentTab.id, loadedExample]);

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
          <Menubar />
          <LiveProvider
            code={theCode}
            scope={scope}
            theme={theme === 'light' ? themes.vsLight : themes.vsDark}
            noInline={true}
            enableTypeScript={true}
            language="jsx"
          >
            <DockLayout
              defaultLayout={defaultLayout}
              groups={groups}
              ref={setDockRef}
              style={{ height: '100%' }}
            />
          </LiveProvider>
        </Stack>
      </div>
    </>
  );
};

export default Wrapper;
