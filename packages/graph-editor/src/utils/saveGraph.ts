import { ImperativeEditorRef } from '@/editor/editorTypes.js';

export async function saveGraph(
  graphRef: ImperativeEditorRef,
  filename: string,
): Promise<boolean> {
  const saved = graphRef.save();
  const blob = new Blob([JSON.stringify(saved)], { type: 'application/json' });

  try {
    const handle = await globalThis.showSaveFilePicker({
      suggestedName: filename + '.json',
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    // we need to return a result so the caller can make decisions based on it
    return true;
  } catch (err) {
    // do nothing if picker fails or is cancelled
    return false;
  }
}
