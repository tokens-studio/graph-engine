import { Button, Dialog, IconButton, Text, TextInput } from '@tokens-studio/ui';
import { Xmark } from 'iconoir-react';
import { title as annotatedTitle } from '@/annotations/index.js';
import {
  graphEditorSelector,
  showSearchSelector,
} from '@/redux/selectors/index.js';
import { useDispatch, useGraph } from '@/hooks/index.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const FindDialog = () => {
  const [id, setId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const localGraph = useGraph();
  const dispatch = useDispatch();
  const graph = useSelector(graphEditorSelector);
  const open = useSelector(showSearchSelector);

  const setOpen = (value: boolean) => {
    dispatch.settings.setShowSearch(value);
  };

  const onClick = () => {
    const reactflow = graph?.getFlow();
    if (!localGraph || !reactflow) {
      return;
    }

    const node = reactflow.getNodes().find((n) => n.id === id);

    if (node) {
      reactflow.fitView({
        padding: 0.2,
        includeHiddenNodes: true,
        nodes: [node],
      });
      setOpen(false);
    }
  };

  const onClickTitle = () => {
    const reactflow = graph?.getFlow();
    if (!localGraph || !reactflow) {
      return;
    }

    const graphNodes = Object.values(localGraph.nodes);

    const graphNode = graphNodes.find(
      (n) => n.annotations[annotatedTitle] === title,
    );
    if (!graphNode) {
      return;
    }
    const flowNode = reactflow.getNode(graphNode?.id);
    if (flowNode) {
      reactflow.fitView({
        padding: 0.2,
        includeHiddenNodes: true,
        nodes: [flowNode],
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Find Node</Dialog.Title>

          <Text>Find by ID</Text>
          <TextInput value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={onClick}>Find</Button>

          <Text>Find by Title</Text>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={onClickTitle}>Find</Button>

          <IconButton
            style={{
              position: 'absolute',
              top: 'var(--component-spacing-lg)',
              right: 'var(--component-spacing-lg)',
            }}
            onClick={() => setOpen(false)}
            aria-label="Close"
            emphasis="low"
            icon={<Xmark />}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
