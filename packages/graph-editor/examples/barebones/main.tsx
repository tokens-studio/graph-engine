import './index.css';
import '@tokens-studio/graph-editor/index.css';
import {
  DropPanelStore,
  Editor,
  PanelGroup,
  PanelItem,
} from '@tokens-studio/graph-editor';
import { LayoutBase } from 'rc-dock';
import React from 'react';
import ReactDOM from 'react-dom/client';
import initialLayout from './initialLayout.json';

const panelGroups = [
  new PanelGroup({
    title: 'Basic Tokens',
    key: 'basic',
    items: [
      new PanelItem({
        type: 'tokens.studio.generic.constant',
        text: 'Tiny Core',
      }),
    ],
  }),
];

const panelItems = new DropPanelStore(panelGroups);

ReactDOM.createRoot(document.getElementById('__cy_root')!).render(
  <React.StrictMode>
    <div id="graph-editor">
      <Editor
        showMenu={false}
        panelItems={panelItems}
        initialLayout={initialLayout as LayoutBase}
      />
    </div>
  </React.StrictMode>,
);
