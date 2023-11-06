import React, { MutableRefObject } from 'react';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';

type EditorRefType = {
  refs: Record<string, MutableRefObject<ImperativeEditorRef>>;
};

const EditorRef = React.createContext<EditorRefType>({
  refs: {},
});

export const EditorRefProvider = ({ children, value }) => {
  return <EditorRef.Provider value={value}>{children}</EditorRef.Provider>;
};

export const useEditorRefs = () => {
  return React.useContext(EditorRef);
};
