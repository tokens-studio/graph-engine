import { DropPanel } from '../panels/dropPanel/index.js';
import { GraphPanel } from '../panels/graph/index.js';

import { Legend } from '../panels/legend/index.js';
import { LogsPanel } from '../panels/logs/index.js';
import { NodeSettingsPanel } from '../panels/nodeSettings/index.js';
import { Settings } from '../panels/settings/index.js';
import { ShortcutsPanel } from '../panels/shortcuts/index.js';
import { UnifiedSheet } from '../panels/unified/index.js';
import React from 'react';

export const layoutButtons = {
  settings: {
    id: 'settings',
    title: 'Settings',
    content: <Settings />,
  },
  nodeSheet: {
    id: 'nodeSheet',
    title: 'Node',
    content: <UnifiedSheet />,
  },
  nodeSettings: {
    id: 'nodeSettings',
    title: 'Node Settings',
    content: <NodeSettingsPanel />,
  },
  keyboardShortcuts: {
    id: 'keyboardShortcuts',
    title: 'Keyboard Shortcuts',
    content: <ShortcutsPanel />,
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
  dropPanel: {
    id: 'dropPanel',
    title: 'Nodes',
    content: <DropPanel />,
  },
};

export type LayoutButtons = keyof typeof layoutButtons;
