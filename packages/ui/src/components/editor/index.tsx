import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { editorTab } from '#/redux/selectors/graph.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Box, Button, Heading, IconButton, Stack, Text, TextInput, Tooltip } from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { Preview } from '../Preview.tsx';

export const EditorTab = ({ id, ...rest }) => {
  const dispatch = useDispatch();
  const [, ref] = useRegisterRef(id);
  const [, setCodeRef] = useRegisterRef('codeEditor');
  const tab = useSelector(editorTab(id));
  const onEditorOutputChange = (output: Record<string, unknown>) => {
    dispatch.editorOutput.set({
      name: tab.title!,
      value: output,
    });
  };

  return (
    <>
      <Editor id={id} ref={ref} onOutputChange={onEditorOutputChange} {...rest} />
      <Stack direction="column" align="end" gap={3} css={{ position: 'absolute', top: '$3', right: '$3', zIndex: 100 }}>
        <Preview codeRef={setCodeRef} />
      </Stack>
    </>
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
