import { createRef } from 'react';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';

/**
 * This is a mutable portion of data storing actual refs as id:Ref
 */
export const EditorRefs = {
  'editor-0': createRef<ImperativeEditorRef>(),
};

export const CodeEditorRef = createRef<HTMLDivElement>();
