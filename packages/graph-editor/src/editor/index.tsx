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
import { Sidesheet } from '../components/panels/sidesheet/index.js';
import { Legend } from '@/components/panels/legend/index.js';
import { MenuBar } from '@/components/menubar/index.js';
import { EditorApp } from './graph.js';
import { useRegisterRef } from '@/hooks/useRegisterRef.ts';
import {
  ArrowUpRightIcon,
  MaximizeIcon,
  MinimizeIcon,
} from '@iconicicons/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { defaultMenuDataFactory } from '@/components/menubar/defaults.tsx';

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

const layoutDataFactory = (props, panelItems, ref): LayoutData => {
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
                  size: 300,
                  tabs: [
                    {
                      group: 'popout',
                      id: 'dropPanel',
                      title: 'Nodes',
                      content: <DropPanel data={panelItems} />,
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
                  cached: true,
                  id: 'graph1',
                  group: 'graph',
                  title: 'Graph',
                  content: (
                    <ReactFlowProvider>
                      <EditorApp {...props} ref={ref} />
                    </ReactFlowProvider>
                  ),
                },
              ],
            },
            {
              size: 300,
              group: 'popout',
              panelLock: { panelStyle: 'graph' },
              tabs: [
                {
                  cached: true,
                  group: 'popout',
                  id: 'sideSheet',
                  title: 'Side Sheet',
                  content: <Sidesheet />,
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
    panelItems = defaultPanelGroupsFactory(),
  } = props;

  const registerDocker = useRegisterRef<DockLayout>('docker');

  //Generate once
  const defaultDockLayout: LayoutData = useMemo(
    () => layoutDataFactory(props, panelItems, ref),
    [],
  );

  return (
    <ExternalLoaderProvider externalLoader={externalLoader}>
      <Stack direction="column" css={{ height: '100%' }}>
        <MenuBar menu={menuItems} />
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

export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    return (
      <ReduxProvider>
        <LayoutController {...props} ref={ref} />
      </ReduxProvider>
    );
  },
);
