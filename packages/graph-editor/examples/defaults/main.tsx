import React from 'react'
import ReactDOM from 'react-dom/client'
import { Editor, defaultPanelGroupsFactory } from '@tokens-studio/graph-editor';
import '@tokens-studio/graph-editor/index.css';
import './index.css';

const panelItems = defaultPanelGroupsFactory();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id='graph-editor'>
      <Editor
        showMenu={true}
        panelItems={panelItems}
      />
    </div>
  </React.StrictMode>,
)
