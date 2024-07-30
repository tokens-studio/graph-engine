import { Button, Stack } from '@tokens-studio/ui';
import { GROUP_NODE_PADDING } from '@/constants.js';
import {
  NodeProps,
  NodeToolbar,
  getNodesBounds,
  useReactFlow,
  useStore,
  useStoreApi,
} from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { parentId } from '@/annotations/index.js';
import { useCallback } from 'react';
import { useLocalGraph } from '@/context/graph.js';
import React from 'react';
import useDetachNodes from '../../../hooks/useDetachNodes.js';

const lineStyle = { borderColor: 'white' };

function GroupNode(props: NodeProps) {
  const { id, data } = props;
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();
  const graph = useLocalGraph()
  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter(
      (n) => n.parentId === id,
    );
    const bounds = getNodesBounds(childNodes);

    return {
      minWidth: bounds.width + GROUP_NODE_PADDING * 2,
      minHeight: bounds.height + GROUP_NODE_PADDING * 2,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [deleteElements, id]);

  const onDetach = useCallback(() => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentId === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);

    graph.removeNode(id);

    childNodeIds.forEach((nodeId) => {
      const graphNode = graph.getNode(nodeId);
      if (graphNode) {
        delete graphNode.annotations[parentId];
      }
    });
  }, [detachNodes, graph, id, store]);

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
