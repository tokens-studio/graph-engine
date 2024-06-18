import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { EditorApp } from './graph';
import { GraphEditorProps, ImperativeEditorRef } from './editorTypes';


/**
 * Each graph editor instance is wrapped in a ReactFlowProvider to provide the necessary context for the graph editor.
 */
// eslint-disable-next-line react/display-name
export const GraphEditor = React.forwardRef<ImperativeEditorRef, GraphEditorProps>((props, ref) => {
    return <ReactFlowProvider>
        <EditorApp {...props} ref={ref} />
    </ReactFlowProvider>
});

