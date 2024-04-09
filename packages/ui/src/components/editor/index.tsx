import { useRegisterRef } from '@/hooks/ref.ts';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Stack } from '@tokens-studio/ui';
import React, { useCallback } from 'react';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router.js';
import { useGetEditor } from '@/hooks/useGetEditor.ts';
import { examples } from '@/examples/examples.tsx';
import { previewCodeSelector } from '@/redux/selectors/index.ts';
import { menu, panelItems,nodeTypes } from '../editorMenu/index.tsx';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';

export const EditorTab = observer(({ ui }: { ui: GlobalState['ui'] }) => {
  const dispatch = useDispatch();
  const previewCode = useSelector(previewCodeSelector);

  const [editorRef, ref] = useRegisterRef('editor');
  const showExamplePicker = ui.showExamplePicker;
  const [loading, setLoading] = React.useState(false);
  const { loadExample } = useGetEditor();

  const router = useRouter();
  const loadParam = router.query.load;

  React.useEffect(() => {
    async function tryLoadExample(file: string) {
      if (loadParam) {
        setLoading(true);
        const example = examples.find((e) => e.key === loadParam);
        console.log('example', example);
        if (example) {
          await loadExample(example.file);
        }
        setLoading(false);
      }
    }

    if (loadParam) {
      tryLoadExample(loadParam as string);
    }
  }, [loadParam, loadExample]);

  const onCloseExamplePicker = useCallback(() => {
    globalState.ui.showExamplePicker.set(false);
  }, []);

  const onOpenExamplePicker = useCallback(() => {
    console.log(editorRef)
    globalState.ui.showExamplePicker.set(true);
  }, []);

  const onEditorOutputChange = (output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: 'output',
      value: output,
    });
  };

  return (
    <Box css={{ position: 'relative', width: '100%', height: '100%' }}>
      <Editor
        id={'editor'}
        ref={ref}
        onOutputChange={onEditorOutputChange}
        showMenu
        menuItems={menu}
        panelItems={panelItems}
        nodeTypes = {nodeTypes}
        emptyContent={<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />}
      ></Editor>
      <ExamplesPicker
        open={showExamplePicker.get()}
        onClose={onCloseExamplePicker}
        loadExample={loadExample}
      />
      <Stack
        direction="column"
        align="end"
        gap={3}
        css={{ position: 'absolute', top: '$3', right: '$3', zIndex: 100 }}
      >
        {/* <Preview codeRef={setCodeRef} /> */}
      </Stack>
      {loading && (
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
});
