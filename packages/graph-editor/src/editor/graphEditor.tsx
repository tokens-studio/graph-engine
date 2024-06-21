import { EditorApp } from './graph';
import { GraphEditorProps, ImperativeEditorRef } from './editorTypes';
import { ReactFlowProvider } from 'reactflow';
import React from 'react';

/**
 * Each graph editor instance is wrapped in a ReactFlowProvider to provide the necessary context for the graph editor.
 */
export const GraphEditor = React.forwardRef<
  ImperativeEditorRef,
  GraphEditorProps
>((props, ref) => {
  return (
    <ReactFlowProvider>
      <EditorApp {...props} ref={ref} />
    </ReactFlowProvider>
  );
});
