import React from 'react';
import { Settings } from "../panels/settings";
import { Inputsheet } from '../panels/inputs';
import { OutputSheet } from '../panels/output';
import { NodeSettingsPanel } from '../panels/nodeSettings';
import { GraphPanel } from '../panels/graph';
import { LogsPanel } from '../panels/logs';
import { Legend } from '../panels/legend';
import { DebugPanel } from '../panels/debugger';
import { DropPanel } from '../panels/dropPanel';

export const layoutButtons = {
    settings: {
        id: 'settings',
        title: 'Settings',
        content: <Settings />,
    },
    inputs: {
        id: 'inputs',
        title: 'Inputs',
        content: <Inputsheet />,
    },
    outputs: {
        id: 'outputs',
        title: 'Outputs',
        content: <OutputSheet />,
    },
    nodeSettings: {
        id: 'nodeSettings',
        title: 'Node Settings',
        content: <NodeSettingsPanel />,
    },
    graphSettings: {
        id: 'graphSettings',
        title: 'Graph Settings',
        content: <GraphPanel />,
    },
    logs: {
        id: 'logs',
        title: 'Logs',
        content: <LogsPanel />,
    },
    legend: {
        id: 'legend',
        title: 'Legend',
        content: <Legend />,
    },
    debugger: {
        id: 'debugger',
        title: 'Debugger',
        content: <DebugPanel />,
    },
    dropPanel: {
        id: 'dropPanel',
        title: 'Nodes',
        content: <DropPanel />,
    }
};

export type LayoutButtons = keyof typeof layoutButtons;
