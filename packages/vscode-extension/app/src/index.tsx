import './index.css';
import '@tokens-studio/graph-editor/index.css';
import {
  AddDropdown,
  AlignDropdown,
  Editor,
  HelpDropdown,
  ImperativeEditorRef,
  LayoutDropdown,
  SettingsToolbarButton,
  ToolbarSeparator,
  ZoomDropdown,
  createTheme,
  defaultPanelGroupsFactory,
} from '@tokens-studio/graph-editor';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import initialLayout from './initialLayout.json';
import type { LayoutBase } from 'rc-dock';

export const vscodeTheme = createTheme('override-theme', {
  colors: {
    bgCanvas: 'var(--vscode-editor-background)',
    bgDefault: '#2d2d2d',
    bgEmphasis: '#2b2b2b',
    bgSubtle: '#373737',
    bgSurface: '#292929',
    borderDefault: '#636363',
    borderMuted: '#2e2e2e',
    borderSubtle: '#454545',
    fgSubtle: '#8a8a8a',
    inputBg: 'var(--vscode-input-background)',
    inputBorderRest: 'var(--vscode-input-border)',
  },
});

let vscode;

// @ts-ignore Only available in VS Code
if (typeof acquireVsCodeApi === 'function') {
  // @ts-ignore
  vscode = acquireVsCodeApi();
}

const panelItems = defaultPanelGroupsFactory();

const Inner = () => {
  const editorRef = React.useRef<ImperativeEditorRef>(null);

  const ref = useCallback((editor) => {
    //@ts-expect-error This is actually mutable
    editorRef.current = editor;
  }, []);

  useEffect(() => {
    const handler = async (e) => {
      const { type, body, requestId } = e.data;
      switch (type) {
        case 'init': {
          if (body?.value) {
            editorRef?.current?.loadRaw(body.value);
          }
          return;
        }
        case 'update': {
          return;
        }
        case 'getFileData': {
          const data = editorRef?.current?.save();
          vscode.postMessage({
            type: 'response',
            requestId,
            body: JSON.stringify(data),
          });
          return;
        }
      }
    };

    // Handle messages from the extension
    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  const toolbarButtons = useMemo(() => {
    return (
      <>
        <AddDropdown />
        <ToolbarSeparator />
        <ZoomDropdown />
        <ToolbarSeparator />
        <AlignDropdown />
        <ToolbarSeparator />
        <ToolbarSeparator />
        <LayoutDropdown />
        <SettingsToolbarButton />
        <HelpDropdown />
      </>
    );
  }, []);

  return (
    <Editor
      ref={ref}
      id="ed1"
      toolbarButtons={toolbarButtons}
      showMenu={false}
      panelItems={panelItems}
      initialLayout={initialLayout as LayoutBase}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="graph-editor" className={vscodeTheme.toString()}>
      <Inner />
    </div>
  </React.StrictMode>,
);

if (vscode) {
  // Signal to VS Code that the webview is initialized.
  vscode.postMessage({ type: 'ready' });
}
