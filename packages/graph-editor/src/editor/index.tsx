import { EditorProps, ImperativeEditorRef } from './editorTypes.js';
import { LayoutController } from './layoutController.js';
import { ReduxProvider } from '../redux/index.js';
import { ToastProvider } from '@/hooks/useToast.js';
import { defaultControls } from '@/registry/control.js';
import { defaultPanelGroupsFactory } from '@/components/index.js';
import { defaultSpecifics } from '@/registry/specifics.js';
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

      toolbarButtons,
      schemas,
      nodeLoader,
      controls = [...defaultControls],
      specifics = defaultSpecifics,
      icons,
    } = props;

    // Note that the provider exists around the layout controller so that the layout controller can register itself during mount
    return (
      <ToastProvider>
        <ReduxProvider
          icons={icons}
          schemas={schemas}
          controls={controls}
          panelItems={panelItems}
          nodeTypes={nodeLoader}
          specifics={specifics}
          capabilities={capabilities}
          toolbarButtons={toolbarButtons}
        >
          <LayoutController {...props} ref={ref} />
        </ReduxProvider>
      </ToastProvider>
    );
  },
);

Editor.displayName = 'Editor';
