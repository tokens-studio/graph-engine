import {
  BoxBase,
  DockLayout,
  LayoutBase,
  LayoutData,
  PanelBase,
  TabBase,
  TabData,
  TabGroup,
} from 'rc-dock';
import { DropPanel } from '@/components/panels/dropPanel/dropPanel.js';
import { EditorProps, ImperativeEditorRef } from './editorTypes.js';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { ExternalLoaderProvider } from '@/context/ExternalLoaderContext.js';
import { FindDialog } from '@/components/dialogs/findDialog.js';
import { GraphEditor } from './graphEditor.js';
import { IconButton, Stack, Tooltip } from '@tokens-studio/ui';
import { Inputsheet } from '@/components/panels/inputs/index.js';
import { MAIN_GRAPH_ID } from '@/constants.js';
import { MenuBar, defaultMenuDataFactory } from '@/components/menubar/index.js';
import { OutputSheet } from '@/components/panels/output/index.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useRegisterRef } from '@/hooks/useRegisterRef.js';
import { useSelector } from 'react-redux';
import Maximize from '@tokens-studio/icons/Maximize.js';
import React, { MutableRefObject, useCallback, useEffect } from 'react';
import Reduce from '@tokens-studio/icons/Reduce.js';
import Xmark from '@tokens-studio/icons/Xmark.js';

const DockButton = (rest) => {
  return (
    <IconButton
      size="small"
      emphasis="low"
      style={{ padding: 'var(--component-spacing-sm)' }}
      {...rest}
    />
  );
};

const groups: Record<string, TabGroup> = {
  popout: {
    animated: false,
    floatable: true,

    panelExtra: (panelData, context) => {
      const buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <Reduce /> : <Maximize />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
        // buttons.push(
        //   <DockButton
        //     key="new-window"
        //     title="Open in new window"
        //     icon={<ArrowUpRight />}
        //     onClick={() => context.dockMove(panelData, null, 'new-window')}
        //   ></DockButton>,
        // );
      }
      buttons.push(
        <DockButton
          key="close"
          title="Close"
          icon={<Xmark />}
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
      const buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <Reduce /> : <Maximize />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
      }

      return <Stack gap={2}>{buttons}</Stack>;
    },
  },
};

function recurseFindGraphPanel(base: BoxBase | PanelBase): PanelBase | null {
  if (base.id === 'graphs') {
    return base as PanelBase;
  }
  //Check if it has children
  if ((base as BoxBase).children) {
    for (const child of (base as BoxBase).children) {
      const found = recurseFindGraphPanel(child);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findGraphPanel(layout: LayoutBase): PanelBase | null {
  //We need to recursively search for the graph panel
  // It is most likely in the dockbox
  const dockbox = recurseFindGraphPanel(layout.dockbox);
  if (dockbox) {
    return dockbox;
  }
  if (layout.floatbox) {
    const floatBox = recurseFindGraphPanel(layout.floatbox);
    if (floatBox) {
      return floatBox;
    }
  } else if (layout.maxbox) {
    const tab = recurseFindGraphPanel(layout.maxbox);
    if (tab) {
      return tab;
    }
  } else if (layout.windowbox) {
    const tab = recurseFindGraphPanel(layout.windowbox);
    if (tab) {
      return tab;
    }
  }
  return null;
}

const defaultLayout: LayoutBase = {
  dockbox: {
    mode: 'vertical',
    children: [
      {
        mode: 'horizontal',
        children: [
          {
            size: 2,
            mode: 'vertical',
            children: [
              {
                mode: 'horizontal',
                children: [
                  {
                    size: 3,
                    mode: 'vertical',
                    children: [
                      {
                        tabs: [
                          {
                            id: 'dropPanel',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    size: 17,
                    mode: 'vertical',
                    children: [
                      {
                        id: 'graphs',
                        size: 700,
                        group: 'graph',
                        tabs: [
                          {
                            id: MAIN_GRAPH_ID,
                          },
                        ],
                      },
                    ],
                  },

                  {
                    size: 4,
                    mode: 'vertical',
                    children: [
                      {
                        size: 12,
                        tabs: [
                          {
                            id: 'input',
                          },
                        ],
                      },
                      {
                        size: 12,
                        tabs: [
                          {
                            id: 'outputs',
                          },
                        ],
                      },
                    ],
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

const layoutLoader = (tab: TabBase, props, ref): TabData => {
  const { id } = tab;

  switch (id) {
    case 'graphs':
      return {
        //@ts-expect-error
        size: 700,
        group: 'graph',
        panelLock: { panelStyle: 'graph' },
        ...tab,
      };
    case MAIN_GRAPH_ID:
      return {
        closable: true,
        cached: true,
        group: 'graph',
        title: 'Graph',
        content: (
          <ErrorBoundary fallback={<ErrorBoundaryContent />}>
            <GraphEditor {...props} id={MAIN_GRAPH_ID} ref={ref} />
          </ErrorBoundary>
        ),
        ...tab
      };

    case 'input':
      return {
        closable: true,
        cached: true,
        group: 'popout',
        title: 'Inputs',
        content: (
          <ErrorBoundary fallback={<ErrorBoundaryContent />}>
            <Inputsheet />
          </ErrorBoundary>
        ),
        ...tab
      };
    case 'outputs':
      return {
        closable: true,
        cached: true,
        group: 'popout',
        title: 'Outputs',
        content: (
          <ErrorBoundary fallback={<ErrorBoundaryContent />}>
            <OutputSheet />
          </ErrorBoundary>
        ),
        ...tab
      };

    case 'dropPanel':
      return {
        group: 'popout',
        title: 'Nodes',
        content: (
          <ErrorBoundary fallback={<ErrorBoundaryContent />}>
            <DropPanel />
          </ErrorBoundary>
        ),
        closable: true,
        ...tab
      };

    default:
      return tab as TabData;
  }
};

export const LayoutController = React.forwardRef<
  ImperativeEditorRef,
  EditorProps
>((props: EditorProps, ref) => {
  const {
    tabLoader,
    externalLoader,
    initialLayout,
    menuItems = defaultMenuDataFactory(),
  } = props;

  const registerDocker = useRegisterRef<DockLayout>('docker');
  const dispatch = useDispatch();

  const dockerRef = useSelector(dockerSelector) as MutableRefObject<DockLayout>;

  const loadTab = useCallback(
    (tab): TabData => {
      const loaded = tabLoader?.(tab);
      if (!loaded) {
        return layoutLoader(tab, props, ref);
      }
      return loaded;
    },
    [tabLoader, props, ref],
  );

  useEffect(() => {
    if (dockerRef?.current && initialLayout) {
      dockerRef.current?.loadLayout(initialLayout);
    }
  }, [dockerRef]);

  const onLayoutChange = (newLayout: LayoutBase) => {
    //We need to find the graph tab container in the newlayout
    const graphContainer = findGraphPanel(newLayout);

    if (graphContainer?.activeId) {
      //Get the active Id to find the currently selected graph
      dispatch.graph.setCurrentPanel(graphContainer.activeId!);
    }
  };

  return (
    <ExternalLoaderProvider externalLoader={externalLoader}>
      <Stack
        className="graph-editor"
        direction="column"
        style={{ height: '100%' }}
      >
        {props.showMenu && <MenuBar menu={menuItems} />}
        <Tooltip.Provider>
          <DockLayout
            ref={registerDocker}
            defaultLayout={defaultLayout as LayoutData}
            groups={groups}
            loadTab={loadTab}
            style={{ flex: 1 }}
            onLayoutChange={onLayoutChange}
          />
          <FindDialog />
        </Tooltip.Provider>
      </Stack>
    </ExternalLoaderProvider>
  );
});
LayoutController.displayName = 'LayoutController';
