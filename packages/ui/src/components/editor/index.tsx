import { useRegisterRef } from '@/hooks/ref.ts';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Stack } from '@tokens-studio/ui';
import React, { useCallback } from 'react';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';

import { useSelector } from 'react-redux';

import { useGetEditor } from '@/hooks/useGetEditor.ts';
import { examples } from '@/data/examples/examples.tsx';
import { previewCodeSelector } from '@/redux/selectors/index.ts';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';
import { capabilities, menu, panelItems, nodeTypes, icons } from './data.ts';

export const EditorTab = observer(({ ui }: { ui: GlobalState['ui'] }) => {
  const dispatch = useDispatch();
  const previewCode = useSelector(previewCodeSelector);

  const [editorRef, ref] = useRegisterRef('editor');
  const showExamplePicker = ui.showExamplePicker;
  const [loading, setLoading] = React.useState(false);
  const { loadExample } = useGetEditor();

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
        id={""}
        ref={ref}
        // onOutputChange={onEditorOutputChange}
        showMenu
        menuItems={menu}
        panelItems={panelItems}
        nodeTypes={nodeTypes}
        capabilities={capabilities}
        icons={icons}
        emptyContent={<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />}
      ></Editor>
      <ExamplesPicker
        open={showExamplePicker.get()}
        onClose={onCloseExamplePicker}
        loadExample={loadExample}
      />
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
