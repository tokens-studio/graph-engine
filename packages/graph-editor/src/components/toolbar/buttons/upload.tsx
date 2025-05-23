import { IconButton, Tooltip } from '@tokens-studio/ui';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { updateGraph } from '@tokens-studio/graph-engine-migration';
import { useSelector } from 'react-redux';
import React from 'react';
import Upload from '@tokens-studio/icons/Upload.js';

export const UploadToolbarButton = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;

  const onUpload = () => {
    if (!graphRef) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    //@ts-expect-error
    input.onchange = (e: HTMLInputElement) => {
      //@ts-expect-error
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        const migratedGraph = await updateGraph(data, { verbose: true });

        graphRef.loadRaw(migratedGraph);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <Tooltip label="Upload" side="bottom">
      <IconButton emphasis="low" onClick={onUpload} icon={<Upload />} />
    </Tooltip>
  );
};
