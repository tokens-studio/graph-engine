import { Download } from 'iconoir-react';
import { IconButton } from '@tokens-studio/ui/IconButton.js';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { Tooltip } from '@tokens-studio/ui/Tooltip.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';
export const DownloadToolbarButton = () => {
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
      <IconButton
        variant="invisible"
        onClick={onDownload}
        icon={<Download />}
      />
    </Tooltip>
  );
};
