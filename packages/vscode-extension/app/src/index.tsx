import './index.css';
import '@tokens-studio/graph-editor/index.css';
import { CapabilityFactory } from '@tokens-studio/graph-engine';
import { Editor, ImperativeEditorRef } from '@tokens-studio/graph-editor';
import { FSCapability } from './lib/capabilities/fs';
import { Loader } from './lib/loader';
import { MessageHandler } from './lib/messageHandler';
import { defaultControls } from '@tokens-studio/graph-editor';
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import initialLayout from './initialLayout.json';
import type { LayoutBase } from 'rc-dock';

import { Toolbar } from './data/toolbar';
import { WebAudioCapability } from '@tokens-studio/graph-engine-nodes-audio/index.js';
import {
  controls as fsControls,
  icons as fsIcons,
} from '@tokens-studio/graph-engine-nodes-fs';
import { nodeTypes } from './data/nodeTypes';
import { panelItems } from './data/panelItems';

const nexus = new MessageHandler();
const loader = new Loader(nexus);
const loadHook = loader.getLoader();

const capabilities: CapabilityFactory[] = [
  WebAudioCapability,
  new FSCapability(nexus).getCapability(),
];

const controls = [...fsControls, ...defaultControls];

const icons = {
  ...fsIcons,
};

const Inner = () => {
  const editorRef = React.useRef<ImperativeEditorRef>(null);

  const ref = useCallback((editor) => {
    //@ts-expect-error This is actually mutable
    editorRef.current = editor;
    nexus.postMessage('ready');
  }, []);

  useEffect(() => {
    const disposers = [
      nexus.on('init', ({ value }) => {
        editorRef?.current?.loadRaw(value);
      }),
      nexus.on('getFileData', (_, requestId) => {
        const data = editorRef?.current?.save();

        nexus.postResponse(requestId, JSON.stringify(data));
      }),
    ];

    return () => {
      disposers.forEach((disposer) => disposer());
    };
  }, []);

  return (
    <Editor
      ref={ref}
      id="ed1"
      toolbarButtons={<Toolbar />}
      externalLoader={loadHook}
      showMenu={false}
      icons={icons}
      panelItems={panelItems}
      capabilities={capabilities}
      controls={controls}
      nodeTypes={nodeTypes}
      initialLayout={initialLayout as LayoutBase}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="graph-editor">
      <Inner />
    </div>
  </React.StrictMode>,
);
