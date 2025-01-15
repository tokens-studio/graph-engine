import {
  Button,
  Dialog,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@tokens-studio/ui';
import { Graph } from '@tokens-studio/graph-engine';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { saveGraph } from '@/utils/saveGraph.js';
import { title } from '@/annotations/index.js';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Upload from '@tokens-studio/icons/Upload.js';
import loadGraph from '@/utils/loadGraph.js';

export const UploadToolbarButton = () => {
  const reactFlowInstance = useReactFlow();
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
  const graph = mainGraph?.graph as Graph;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUploadClick = () => {
    const isCurrentGraphEmpty =
      !graph?.nodes || Object.keys(graph.nodes).length === 0;

    if (!isCurrentGraphEmpty) {
      setIsDialogOpen(true);
    } else {
      loadGraph(graphRef, graph, reactFlowInstance);
    }
  };

  const onDownload = async () => {
    if (!graphRef) return;

    const saved = await saveGraph(
      graphRef,
      (graph.annotations[title] || 'graph').toLowerCase().replace(/\s+/g, '-'),
    );

    setIsDialogOpen(false);

    if (saved) {
      loadGraph(graphRef, graph, reactFlowInstance);
    }
  };

  const onDiscard = () => {
    setIsDialogOpen(false);
    loadGraph(graphRef, graph, reactFlowInstance);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <Tooltip label="Upload" side="bottom">
          <IconButton
            emphasis="low"
            icon={<Upload />}
            onClick={handleUploadClick}
          />
        </Tooltip>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Stack direction="column" gap={4}>
            <Dialog.Title>Download Current Graph?</Dialog.Title>
            <Text>
              Do you want to download the current graph before uploading a new
              one?
            </Text>
            <Stack direction="row" gap={2} justify="end">
              <Dialog.Close asChild>
                <Button emphasis="low" onClick={onDiscard}>
                  Discard
                </Button>
              </Dialog.Close>
              <Button emphasis="high" onClick={onDownload}>
                Download
              </Button>
            </Stack>
          </Stack>
          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
