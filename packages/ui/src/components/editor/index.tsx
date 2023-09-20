import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { editorTab } from '#/redux/selectors/graph.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Button, Heading, IconButton, Stack, Text, TextInput, Tooltip } from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { Preview } from '../Preview.tsx';
import { Menubar } from '../editorMenu/index.tsx';
import { useCallback } from 'react';
import { useTheme } from '#/hooks/useTheme.tsx';

export const EditorTab = ({ id, ...rest }) => {
  const dispatch = useDispatch();
  const [, ref] = useRegisterRef(id);
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const tab = useSelector(editorTab(id));
  const theme = useTheme();
  const onEditorOutputChange = (output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: tab.title!,
      value: output,
    });
  };

  const toggleTheme = useCallback(() => dispatch.ui.toggleTheme(null), [dispatch.ui]);

  return (
    <Box css={{position: 'relative', width: '100%', height: '100%'}}>
      <Editor id={id} ref={ref} onOutputChange={onEditorOutputChange} menuContent={<Menubar toggleTheme={toggleTheme} theme={theme}/>} {...rest} />
      <Stack direction="column" align="end" gap={3} css={{ position: 'absolute', top: '$3', right: '$3', zIndex: 100 }}>
        <Preview codeRef={setCodeRef} />
      </Stack>
    </Box>
  );
};

export const EditorDockTab = ({ id }) => {
  const tab = useSelector(editorTab(id));
  return (
    <Stack align="center" gap={2}>
      <Text>{tab.title}</Text>
    </Stack>
  );
};
