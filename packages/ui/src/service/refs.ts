import { MutableRefObject, createRef } from 'react';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';

/**
 * This is a mutable portion of data storing actual refs as id:Ref
 */
export const EditorRefs: Record<
  string,
  MutableRefObject<ImperativeEditorRef>
> = {
  'editor-0': createRef(),
};

export const CodeEditorRef = createRef<HTMLDivElement>();
