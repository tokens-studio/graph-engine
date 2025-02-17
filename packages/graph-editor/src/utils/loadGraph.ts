import { Graph } from '@tokens-studio/graph-engine';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { ReactFlowInstance } from 'reactflow';
import { clear } from '@/editor/actions/clear.js';

export default function loadGraph(
  graphRef: ImperativeEditorRef | undefined,
  graph: Graph,
  reactFlowInstance: ReactFlowInstance,
) {
  if (!graphRef) return;

  // always clear the graph before loading a new one,
  // the user already had the choice to save it
  clear(reactFlowInstance, graph);

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  //@ts-expect-error
  input.onchange = (e: HTMLInputElement) => {
    //@ts-expect-error
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const data = JSON.parse(text);
      graphRef.loadRaw(data);
    };
    reader.readAsText(file);
  };
  input.click();
}
