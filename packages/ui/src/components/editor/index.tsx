import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Stack } from '@tokens-studio/ui';
import { Preview } from '../Preview.tsx';
import { Menubar } from '../editorMenu/index.tsx';
import { useCallback } from 'react';
import { useTheme } from '#/hooks/useTheme.tsx';

export const EditorTab = ({ ...rest }) => {
  const dispatch = useDispatch();
  const [, ref] = useRegisterRef('editor');
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const theme = useTheme();
  const onEditorOutputChange = (output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: 'output',
      value: output,
    });
  };

  const toggleTheme = useCallback(
    () => dispatch.ui.toggleTheme(null),
    [dispatch.ui],
  );

  return (
    <Box css={{ position: 'relative', width: '100%', height: '100%' }}>
      <Editor
        id={'editor'}
        ref={ref}
        onOutputChange={onEditorOutputChange}
        menuContent={<Menubar toggleTheme={toggleTheme} theme={theme} />}
        {...rest}
      />
      <Stack
        direction="column"
        align="end"
        gap={3}
        css={{ position: 'absolute', top: '$3', right: '$3', zIndex: 100 }}
      >
        <Preview codeRef={setCodeRef} />
      </Stack>
    </Box>
  );
};
