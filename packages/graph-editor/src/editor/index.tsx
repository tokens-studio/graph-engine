/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import '../index.css';
import { DockLayout, LayoutData, TabGroup } from 'rc-dock';
import { ReactFlowProvider } from 'reactflow';

import React, { useMemo } from 'react';
import { ReduxProvider } from '../redux/index.js';
import { EditorProps, ImperativeEditorRef } from './editorTypes.ts';
import { IconButton, Stack, Tooltip } from '@tokens-studio/ui';
import { DropPanel } from '@/components/panels/dropPanel/index.js';
import { ExternalLoaderProvider } from '@/context/ExternalLoaderContext.js';
import { defaultPanelGroupsFactory } from '@/components/panels/dropPanel/index.js';
import { OutputSheet } from '../components/panels/output/index.js';
import { Legend } from '@/components/panels/legend/index.js';
import { MenuBar } from '@/components/menubar/index.js';
import { EditorApp } from './graph.js';
import { useRegisterRef } from '@/hooks/useRegisterRef.ts';
import { MaximizeIcon, MinimizeIcon } from '@iconicicons/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { defaultMenuDataFactory } from '@/components/menubar/defaults.tsx';
import { Inputsheet } from '@/components/panels/inputs/index.tsx';
import { NodeSettingsPanel } from '@/components/panels/nodeSettings/index.tsx';
import { LogsPanel } from '@/components/panels/logs/index.tsx';
import { PlayPanel } from '@/components/panels/play/index.tsx';
import { GraphPanel } from '@/components/panels/graph/index.tsx';
import { FlameGraph } from '@/components/panels/flamegraph/index.tsx';
import { GraphEditor } from './graphEditor.tsx';

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
    animated: true,
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
        //@todo fix. Caused by stitches not working when moved across to popup
        // buttons.push(
        //   <DockButton
        //     key="new-window"
        //     title="Open in new window"
        //     icon={<ArrowUpRightIcon />}
        //     onClick={() => context.dockMove(panelData, null, 'new-window')}
        //   ></DockButton>,
        // );
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
    animated: true,
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

const layoutDataFactory = (props, ref): LayoutData => {
  return {
    dockbox: {
      mode: 'vertical',
      children: [
        {
          mode: 'horizontal',
          children: [
            {
              mode: 'vertical',
              children: [
                {
                  size: 78,
                  tabs: [
                    {
                      group: 'popout',
                      id: 'playControls',
                      title: 'Play Controls',
                      content: <PlayPanel />,
                    },
                  ],
                },
                {
                  size: 545,
                  tabs: [
                    {
                      group: 'popout',
                      id: 'dropPanel',
                      title: 'Nodes',
                      content: <DropPanel />,
                    },
                  ],
                },
                {
                  size: 300,
                  tabs: [
                    {
                      group: 'popout',
                      id: 'legend',
                      title: 'Legend',
                      content: <Legend />,
                    },
                  ],
                },
              ],
            },

            {
              id: 'graphs',
              size: 700,
              group: 'graph',
              panelLock: { panelStyle: 'graph' },
              tabs: [
                {
                  closable: true,
                  cached: true,
                  id: 'graph1',
                  group: 'graph',
                  title: 'Graph',
                  content: (
                    <GraphEditor {...props} ref={ref} />
                  ),
                },
              ],
            },
            {
              size: 300,
              mode: 'vertical',
              children: [
                {
                  size: 300,
                  tabs: [
                    {
                      closable: true,
                      cached: true,
                      group: 'popout',
                      id: 'input',
                      title: 'Inputs',
                      content: <Inputsheet />,
                    },
                    {
                      closable: true,
                      cached: true,
                      group: 'popout',
                      id: 'nodeSettings',
                      title: 'Node Settings',
                      content: <NodeSettingsPanel />,
                    },
                    {
                      closable: true,
                      cached: true,
                      group: 'popout',
                      id: 'logs',
                      title: 'Logs',
                      content: <LogsPanel />,
                    },
                  ],
                },
                {
                  size: 300,
                  tabs: [
                    {
                      closable: true,
                      cached: true,
                      group: 'popout',
                      id: 'outputs',
                      title: 'Outputs',
                      content: <OutputSheet />,
                    },
                    {
                      closable: true,
                      group: 'popout',
                      id: 'graphSettings',
                      title: 'Graph Settings',
                      content: <GraphPanel />,
                    },
                    {
                      closable: true,
                      group: 'popout',
                      id: 'flamegraph',
                      title: 'Flamegraph',
                      content: <FlameGraph />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
};

export const LayoutController = React.forwardRef<
  ImperativeEditorRef,
  EditorProps
>((props: EditorProps, ref) => {
  const {
    externalLoader,
    menuItems = defaultMenuDataFactory(),
  } = props;

  const registerDocker = useRegisterRef<DockLayout>('docker');

  //Generate once
  const defaultDockLayout: LayoutData = useMemo(
    () => layoutDataFactory(props, ref),
    [],
  );

  return (
    <ExternalLoaderProvider externalLoader={externalLoader}>
      <Stack direction="column" css={{ height: '100%' }}>
        {props.showMenu && <MenuBar menu={menuItems} />}
        <Tooltip.Provider>
          <DockLayout
            ref={registerDocker}
            defaultLayout={defaultDockLayout}
            groups={groups}
            style={{ flex: 1 }}
          />
        </Tooltip.Provider>
      </Stack>
    </ExternalLoaderProvider>
  );
});


/**
 * The main editor component
 * 
 */
export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {

    const {
      panelItems,
      capabilities,
      icons
    } = props;

    // Note that the provider exists around the layout controller so that the layout controller can register itself during mount
    return (
      <ReduxProvider
        icons={icons}
        panelItems={panelItems}
        capabilities={capabilities}>
        <LayoutController {...props} ref={ref} />
      </ReduxProvider>
    );
  },
);

