import React from 'react'
import ReactDOM from 'react-dom/client'
import { Editor, PanelGroup, DropPanelStore, PanelItem } from '@tokens-studio/graph-editor';
import initialLayout from './initialLayout.json'
import '@tokens-studio/graph-editor/index.css';
import './index.css';
import { LayoutBase } from 'rc-dock';
import {  PlusIcon } from '@radix-ui/react-icons';

const panelGroups = [new PanelGroup({
  title: 'Basic Tokens',
  key: 'basic',
  items:[
    new PanelItem({
      type: 'tokens.studio.generic.constant',
      icon: <PlusIcon />,
      text: 'Tiny Core',
    }),
  ]
})]

const panelItems = new DropPanelStore(panelGroups);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id='graph-editor'>
      <Editor
        showMenu={false}
        panelItems={panelItems}
        initialLayout={initialLayout as LayoutBase}
      />
    </div>
  </React.StrictMode>,
)
