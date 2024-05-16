/* eslint-disable react/display-name */
// import 'reactflow/dist/style.css';
import '../index.scss';
import React from 'react';
import { ReduxProvider } from '../redux/index.js';
import { EditorProps, ImperativeEditorRef } from './editorTypes.js';
import { LayoutController } from './layoutController.js';
import { nodeLookup as defaultNodeLookup } from '@tokens-studio/graph-engine';
import { ToastProvider } from '@/hooks/useToast';
import { defaultSpecifics } from '..';

/**
 * The main editor component
 * 
 */
export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {

    const {
      panelItems,
      capabilities,
      nodeTypes = defaultNodeLookup,
      controls,
      specifics = defaultSpecifics,
      icons
    } = props;

    // Note that the provider exists around the layout controller so that the layout controller can register itself during mount
    return (
      <ToastProvider>
        <ReduxProvider
          icons={icons}
          controls={controls}
          panelItems={panelItems}
          nodeTypes={nodeTypes}
          specifics={specifics}
          capabilities={capabilities}>
          <LayoutController {...props} ref={ref} />
        </ReduxProvider>
      </ToastProvider>
    );
  },
);

