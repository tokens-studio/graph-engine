import { useDispatch } from '@/hooks/useDispatch.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Spinner } from '@tokens-studio/ui';
import React, { forwardRef, useCallback } from 'react';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';


import { useGetEditor } from '@/hooks/useGetEditor.ts';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { capabilities, menu, panelItems, nodeTypes, icons, controls } from './data.ts';

export const EditorTab = forwardRef(({ loading }: { loading?: boolean }, ref) => {
  const dispatch = useDispatch();


  const { loadExample } = useGetEditor();

  const onCloseExamplePicker = useCallback(() => {
    globalState.ui.showExamplePicker.set(false);
  }, []);

  const onOpenExamplePicker = useCallback(() => {
    globalState.ui.showExamplePicker.set(true);
  }, []);


  return (
    <Box css={{ position: 'relative', width: '100%', height: '100%' }}>
      <Editor
        id={""}
        ref={ref}
        showMenu
        menuItems={menu}
        panelItems={panelItems}
        nodeTypes={nodeTypes}
        capabilities={capabilities}
        controls={controls}
        icons={icons}
        // emptyContent={<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />}
      ></Editor>
      {/* <ExamplesPicker
        open={showExamplePicker.get()}
        onClose={onCloseExamplePicker}
        loadExample={loadExample}
      /> */}
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
          <Spinner />
        </Box>
      )}
    </Box>
  );
});

EditorTab.displayName = 'EditorTab';