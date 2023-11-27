import { usePreviewContext } from '#/providers/preview.tsx';
import { store } from '#/redux/store.tsx';

export function useGetEditor() {
  const { setCode, code } = usePreviewContext();

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
        setCode(loadedCode);
      }

      await editor.current.load({
        nodeState: loadedState,
        nodes,
        edges,
      });
    }, 0);
    return Promise.resolve()
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
      code,
    };

    return fileContent;
  }
  return { getJSON, loadExample };
}
