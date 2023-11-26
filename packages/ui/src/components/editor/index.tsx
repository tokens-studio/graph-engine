import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Stack } from '@tokens-studio/ui';
import { Preview } from '../Preview.tsx';
import { Menubar } from '../editorMenu/index.tsx';
import React, { useCallback } from 'react';
import { useTheme } from '#/hooks/useTheme.tsx';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
import { showExamplePickerSelector } from '#/redux/selectors/index.ts';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useGetEditor } from '#/hooks/useGetEditor.ts';
import { examples } from '#/examples/examples.tsx';
import { previewCodeSelector } from '#/redux/selectors/index.ts';
import { useShareURL } from '#/hooks/useShareURL.ts';
import { useSearchParams } from 'next/navigation'

export const EditorTab = ({ ...rest }) => {
  const dispatch = useDispatch();
  const previewCode = useSelector(previewCodeSelector);
  const { getSupabaseEntry } = useShareURL();
  const [, ref] = useRegisterRef('editor');
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const showExamplePicker = useSelector(showExamplePickerSelector);
  const { loadExample } = useGetEditor();
  const router = useRouter();

  // console.log('Load param', idParam);

  const isLoading = React.useRef(false);

  React.useEffect(() => {
    async function tryLoadExample(idParam: string) {
      console.log("Trying to load", idParam)
      if (idParam && !isLoading.current) {
        isLoading.current = true;
        console.log("IS FETCHING NOOOW")
        await getSupabaseEntry(idParam);
        console.log("is done, setting to false")
        isLoading.current = false;
      }
    }

    if (router.query.id) {
      tryLoadExample(router.query.id);
    }
  }, [router.query.id, isLoading.current]);

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
            previewCode={previewCode}
            setPreviewCode={dispatch.ui.setPreviewCode}
          />
        }
        emptyContent={<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />}
        {...rest}
      >
        <ExamplesPicker
          open={showExamplePicker}
          onClose={onCloseExamplePicker}
          loadExample={loadExample}
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
      {isLoading.current && (
        <Box
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '$bgDefault',
            opacity: 0.5,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading
        </Box>
      )}
    </Box>
  );
};
