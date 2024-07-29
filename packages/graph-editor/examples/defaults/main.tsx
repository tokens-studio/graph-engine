import './index.css';
import '@tokens-studio/graph-editor/index.css';
import { Editor, defaultPanelGroupsFactory } from '@tokens-studio/graph-editor';
import React from 'react';
import ReactDOM from 'react-dom/client';

const panelItems = defaultPanelGroupsFactory();

ReactDOM.createRoot(document.getElementById('__cy_root')!).render(
  <React.StrictMode>
    <div id="graph-editor">
      <Editor showMenu={true} panelItems={panelItems} />
    </div>
  </React.StrictMode>,
);
