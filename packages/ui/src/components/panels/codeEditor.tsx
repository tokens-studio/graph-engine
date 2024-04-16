import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import React from 'react';

export const CodePanel = () => {

    return <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
};