import { SerializedGraph } from '@tokens-studio/graph-engine';
import globalState from '@/mobx/index.tsx';

export function useGetEditor() {
  async function loadExample(file) {
    const editor = globalState.refs.editor.get();
    if (!editor) {
      return;
    }

    await editor.clear();
    await editor.loadRaw(file as SerializedGraph);
  }

  return { loadExample };
}
