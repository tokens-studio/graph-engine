import { DebugPanel } from '../panels/debugger';
import { DropPanel } from '../panels/dropPanel';
import { GraphPanel } from '../panels/graph';
import { Inputsheet } from '../panels/inputs';
import { Legend } from '../panels/legend';
import { LogsPanel } from '../panels/logs';
import { NodeSettingsPanel } from '../panels/nodeSettings';
import { OutputSheet } from '../panels/output';
import { Settings } from '../panels/settings';
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
};

export type LayoutButtons = keyof typeof layoutButtons;
