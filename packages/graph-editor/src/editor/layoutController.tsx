import { Inputsheet } from "@/components/panels/inputs";
import { GraphEditor } from "./graphEditor";
import { NodeSettingsPanel } from "@/components/panels/nodeSettings";
import { PlayPanel } from "@/components/panels/play";
import { Legend } from "@/components/panels/legend";
import { LogsPanel } from "@/components/panels/logs";
import { OutputSheet } from "@/components/panels/output";
import { GraphPanel } from "@/components/panels/graph";
import { FlameGraph } from "@/components/panels/flamegraph";
import { MaximizeIcon, MinimizeIcon } from "@iconicicons/react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { IconButton, Stack, Tooltip } from '@tokens-studio/ui';
import { DropPanel } from '@/components/panels/dropPanel/index.js';
import { ExternalLoaderProvider } from '@/context/ExternalLoaderContext.js';
import { defaultPanelGroupsFactory } from '@/components/panels/dropPanel/index.js';
import { MenuBar } from '@/components/menubar/index.js';
import { EditorApp } from './graph.js';
import { useRegisterRef } from '@/hooks/useRegisterRef.ts';
import { defaultMenuDataFactory } from '@/components/menubar/defaults.tsx';
import { useSelector } from 'react-redux';
import { dockerSelector } from '@/redux/selectors/refs.ts';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { BoxBase, DockLayout, LayoutBase, LayoutData, PanelBase, TabData, TabGroup } from 'rc-dock';


import React, { MutableRefObject, useMemo } from 'react';
import { EditorProps, ImperativeEditorRef } from "./editorTypes.js";

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
                                        <GraphEditor {...props} id='graph1' ref={ref} />
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
    const dispatch = useDispatch();

    //Generate once
    const defaultDockLayout: LayoutData = useMemo(
        () => layoutDataFactory(props, ref),
        [],
    );

    const onLayoutChange = (newLayout: LayoutBase, currentTabId: string) => {

        //We need to find the graph tab container in the newlayout 
        const graphContainer = findGraphPanel(newLayout);

        if (graphContainer) {
            //Get the active Id to find the currently selected graph
            dispatch.graph.setCurrentPanel(graphContainer.activeId!);
        }
        // dispatch.
    }

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
                        onLayoutChange={onLayoutChange}
                    />
                </Tooltip.Provider>
            </Stack>
        </ExternalLoaderProvider>
    );

});
LayoutController.displayName = 'LayoutController';