/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import '../index.css';
import React from 'react';
import { ReduxProvider } from '../redux/index.js';
import { EditorProps, ImperativeEditorRef } from './editorTypes.ts';
import { LayoutController } from './layoutController.tsx';

/**
 * The main editor component
 * 
 */
export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {

    const {
      panelItems,
      capabilities,
      icons
    } = props;

    // Note that the provider exists around the layout controller so that the layout controller can register itself during mount
    return (
      <ReduxProvider
        icons={icons}
        panelItems={panelItems}
        capabilities={capabilities}>
        <LayoutController {...props} ref={ref} />
      </ReduxProvider>
    );
  },
);

