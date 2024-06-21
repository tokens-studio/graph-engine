import '../index.scss';
import { EditorProps, ImperativeEditorRef } from './editorTypes.js';
import { LayoutController } from './layoutController.js';
import { ReduxProvider } from '../redux/index.js';
import { ToastProvider } from '@/hooks/useToast';
import {
  defaultControls,
  defaultPanelGroupsFactory,
  defaultSpecifics,
} from '..';
import { nodeLookup as defaultNodeLookup } from '@tokens-studio/graph-engine';
import React from 'react';

/**
 * The main editor component
 *
 */
export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const {
      panelItems = defaultPanelGroupsFactory(),
      capabilities,
      nodeTypes = defaultNodeLookup,
      controls = [...defaultControls],
      specifics = defaultSpecifics,
      icons,
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
          capabilities={capabilities}
        >
          <LayoutController {...props} ref={ref} />
        </ReduxProvider>
      </ToastProvider>
    );
  },
);
