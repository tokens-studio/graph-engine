import { DebugPanel } from '../panels/debugger/index.js';
import { DropPanel } from '../panels/dropPanel/index.js';
import { GraphPanel } from '../panels/graph/index.js';
import { Inputsheet } from '../panels/inputs/index.js';
import { Legend } from '../panels/legend/index.js';
import { LogsPanel } from '../panels/logs/index.js';
import { NodeSettingsPanel } from '../panels/nodeSettings/index.js';
import { Navigator } from '../panels/navigator/index.js';
import { OutputSheet } from '../panels/output/index.js';
import { Settings } from '../panels/settings/index.js';
import React from 'react';

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
  },
  navigator: {
    id: 'navigator',
    title: 'Navigator',
    content: <Navigator />,
  },
};

export type LayoutButtons = keyof typeof layoutButtons;
