import { Graph } from '@tokens-studio/graph-engine';
import { IconButton, Tooltip } from '@tokens-studio/ui';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { saveGraph } from '@/utils/saveGraph.js';
import { title } from '@/annotations/index.js';
import { useSelector } from 'react-redux';
import Download from '@tokens-studio/icons/Download.js';
import React from 'react';

export const DownloadToolbarButton = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
  const graph = mainGraph?.graph as Graph;

  const onDownload = async () => {
    await saveGraph(
      graphRef!,
      (graph.annotations[title] || 'graph').toLowerCase().replace(/\s+/g, '-'),
    );
  };

  return (
    <Tooltip label="Download" side="bottom">
      <IconButton emphasis="low" onClick={onDownload} icon={<Download />} />
    </Tooltip>
  );
};
