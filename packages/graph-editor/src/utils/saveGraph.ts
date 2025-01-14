import { Graph } from '@tokens-studio/graph-engine';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';

export function saveGraph(
  graphRef: ImperativeEditorRef,
  graph: Graph,
  filename: string,
) {
  const saved = graphRef.save();

  const blob = new Blob([JSON.stringify(saved)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;

  link.download = filename + '.json';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
