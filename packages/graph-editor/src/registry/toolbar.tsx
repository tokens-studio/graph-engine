import { Button, Tooltip } from '@tokens-studio/ui';
import { Download, Upload } from 'iconoir-react';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';

const DownloadButton = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;

  const onDownload = () => {
    const saved = graphRef!.save();
    const blob = new Blob([JSON.stringify(saved)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph.json';
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Tooltip label="Download" side="bottom">
      <Button
        variant="invisible"
        onClick={onDownload}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      >
        <Download />
      </Button>
    </Tooltip>
  );
};

const UploadButton = () => {
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
      <Button
        variant="invisible"
        onClick={onUpload}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      >
        <Upload />
      </Button>
    </Tooltip>
  );
};

export const DefaultToolbarButtons = [<DownloadButton />, <UploadButton />];
