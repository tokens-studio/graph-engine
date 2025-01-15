import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import '@fontsource/geist-mono/600.css';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';

import './index.css';
import '@tokens-studio/graph-editor/index.css';

import '@tokens-studio/tokens/css/ts-theme-dark.css';
import '@tokens-studio/tokens/css/ts-theme-light.css';

import '@tokens-studio/tokens/css/base.css';
import '@tokens-studio/ui/normalize.css';
import { Editor, defaultPanelGroupsFactory } from '@tokens-studio/graph-editor';
import React from 'react';
import ReactDOM from 'react-dom/client';

const panelItems = defaultPanelGroupsFactory();

ReactDOM.createRoot(document.getElementById('__cy_root')!).render(
  <React.StrictMode>
    <div className="ts-theme-dark" id="graph-editor">
      <Editor panelItems={panelItems} />
    </div>
  </React.StrictMode>,
);
