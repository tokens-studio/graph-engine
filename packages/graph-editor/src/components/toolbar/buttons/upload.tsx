import { IconButton, Tooltip } from '@tokens-studio/ui';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { Upload } from 'iconoir-react';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';

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
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        graphRef.loadRaw(data);
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
