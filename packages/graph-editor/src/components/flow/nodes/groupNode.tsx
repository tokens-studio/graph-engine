import React from 'react';
import {
  NodeProps,
  NodeToolbar,
  getRectOfNodes,
  useReactFlow,
  useStore,
  useStoreApi,
} from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { useCallback } from 'react';
import useDetachNodes from '../../../hooks/useDetachNodes.ts';
import { Button, Stack } from '@tokens-studio/ui';

const lineStyle = { borderColor: 'white' };
const padding = 25;

function GroupNode(props: NodeProps) {
  const { id, data } = props;
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();
  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter(
      (n) => n.parentNode === id,
    );
    const rect = getRectOfNodes(childNodes);

    return {
      minWidth: rect.width + padding * 2,
      minHeight: rect.height + padding * 2,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [deleteElements, id]);

  const onDetach = useCallback(() => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);
  }, [detachNodes, id, store]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        background: `${data.color || '#FF0000'}40`,
      }}
    >
      <NodeResizer
        lineStyle={lineStyle}
        minWidth={minWidth}
        minHeight={minHeight}
      />

      <NodeToolbar className="nodrag">
        <Stack direction="row" gap={2}>
          <Button onClick={onDelete}>Delete</Button>
          {hasChildNodes && <Button onClick={onDetach}>Ungroup</Button>}
        </Stack>
      </NodeToolbar>
    </div>
  );
}

type IsEqualCompareObj = {
  minWidth: number;
  minHeight: number;
  hasChildNodes: boolean;
};

function isEqual(prev: IsEqualCompareObj, next: IsEqualCompareObj): boolean {
  return (
    prev.minWidth === next.minWidth &&
    prev.minHeight === next.minHeight &&
    prev.hasChildNodes === next.hasChildNodes
  );
}

export default GroupNode;
