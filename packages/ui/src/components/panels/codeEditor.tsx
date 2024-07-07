import Editor, { EditorProps } from '@monaco-editor/react';
import React from 'react';

const MonacoEditor = Editor as unknown as React.FC<EditorProps>;

export const CodePanel = () => {
	return (
		<MonacoEditor
			height='90vh'
			defaultLanguage='javascript'
			defaultValue='// some comment'
		/>
	);
};
