import { EditorApp } from './graph.js';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { GraphEditorProps, ImperativeEditorRef } from './editorTypes.js';
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

// HACK: Workaround for circular dependency not allowed for nextjs
// E.g.: when trying to create a new graph editor instance as a tab
if (typeof window !== 'undefined') {
  window['newGraphEditor'] = function (ref, id) {
    return (
      <ErrorBoundary fallback={<ErrorBoundaryContent />}>
        <GraphEditor ref={ref} id={id} />
      </ErrorBoundary>
    );
  };
}
