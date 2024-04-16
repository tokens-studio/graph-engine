import { previewCodeSelector } from '@/redux/selectors/index.ts';
import { store } from '@/redux/store.tsx';
import { useSelector } from 'react-redux';
import { useDispatch } from './useDispatch.ts';

export function useGetEditor() {
  const previewCode = useSelector(previewCodeSelector);
  const dispatch = useDispatch();

  //TODO FIX, we should be opening a new tab with the example
  async function loadExample(file) {
    
    const editor = store.getState().refs.editor;

    if (!editor) {
      return;
    }

    const { state: loadedState, code: loadedCode, nodes, edges } = file;

    // TODO, this needs a refactor. We need to wait for the clear to finish
    // as the nodes still get one final update by the dispatch before they are removed which
    // causes nulls to occur everywhere. They need to be unmounted

    editor.current.clear();

    setTimeout(async () => {
      if (loadedCode !== undefined) {
        dispatch.ui.setPreviewCode(loadedCode);
      }

      await editor.current.loadRaw(file);
    }, 0);
    return Promise.resolve();
    
  }

  function getJSON() {
    const editor = store.getState().refs.editor;

    if (!editor) {
      return;
    }
    const { nodes, nodeState, ...rest } = editor.current.save();

    const finalState = nodes.reduce((acc, node) => {
      acc[node.id] = nodeState[node.id];
      return acc;
    }, {});

    const fileContent = {
      nodes,
      ...rest,
      state: finalState,
      previewCode,
    };

    return fileContent;
  }
  return { getJSON, loadExample };
}
