import { EditorProps, ImperativeEditorRef } from './editorTypes.js';
import { LayoutController } from './layoutController.js';
import { ReduxProvider } from '../redux/index.js';
import { ToastProvider } from '@/hooks/useToast.js';

import { SystemContext } from '@/system/hook.js';
import React from 'react';

/**
 * The main editor component
 *
 */
export const Editor = React.forwardRef<ImperativeEditorRef, EditorProps>(
  (props: EditorProps, ref) => {
    const { schemas } = props;

    // Note that the provider exists around the layout controller so that the layout controller can register itself during mount
    return (
      <ToastProvider>
        <SystemContext.Provider value={props.system}>
          <ReduxProvider schemas={schemas}>
            <LayoutController {...props} ref={ref} />
          </ReduxProvider>
        </SystemContext.Provider>
      </ToastProvider>
    );
  },
);

Editor.displayName = 'Editor';
