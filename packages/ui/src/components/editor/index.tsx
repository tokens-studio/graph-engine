import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Stack } from '@tokens-studio/ui';
import { Preview } from '../Preview.tsx';
import { Menubar } from '../editorMenu/index.tsx';
import { useCallback } from 'react';
import { useTheme } from '#/hooks/useTheme.tsx';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
import { showExamplePickerSelector } from '#/redux/selectors/index.ts';
import { useSelector } from 'react-redux';

export const EditorTab = ({ ...rest }) => {
  const dispatch = useDispatch();
  const [, ref] = useRegisterRef('editor');
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const showExamplePicker = useSelector(showExamplePickerSelector);

  const onCloseExamplePicker = useCallback(() => {
    dispatch.ui.setShowExamplePicker(false);
  }, [dispatch.ui]);

  const onOpenExamplePicker = useCallback(() => {
    dispatch.ui.setShowExamplePicker(true);
  }, [dispatch.ui]);

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
        menuContent={
          <Menubar
            toggleTheme={toggleTheme}
            theme={theme}
            onLoadExamples={onOpenExamplePicker}
          />
        }
        emptyContent={<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />}
        {...rest}
      >
        <ExamplesPicker
          open={showExamplePicker}
          onClose={onCloseExamplePicker}
        />
      </Editor>
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
