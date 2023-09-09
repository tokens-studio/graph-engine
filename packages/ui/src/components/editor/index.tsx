import { useRegisterRef } from '#/hooks/ref.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { editorTab } from '#/redux/selectors/graph.ts';
import { Editor } from '@tokens-studio/graph-editor';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { Preview } from '../Preview.tsx';
import { Toolbar } from '../Toolbar.tsx';

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
    <Preview codeRef={setCodeRef} />
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
