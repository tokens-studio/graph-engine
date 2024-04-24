import { Button } from '@tokens-studio/ui';
import {
  Node,
  NodeToolbar,
  getRectOfNodes,
  useNodes,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import { NodeTypes } from '../types.js';
import React from 'react';

import { getId } from '../utils.js';

const padding = 25;

export default function SelectedNodesToolbar() {
  const nodes = useNodes();
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const selectedNodes = nodes.filter(
    (node) => node.selected && !node.parentNode,
  );
  const selectedNodeIds = selectedNodes.map((node) => node.id);
  const isVisible = selectedNodeIds.length > 1;

  const onGroup = () => {
    const rectOfNodes = getRectOfNodes(selectedNodes);
    const groupId = getId('group');
    const parentPosition = {
      x: rectOfNodes.x,
      y: rectOfNodes.y,
    };
    const groupNode = {
      id: groupId,
      type: NodeTypes.GROUP,
      position: parentPosition,
      style: {
        width: rectOfNodes.width + padding * 2,
        height: rectOfNodes.height + padding * 2,
      },
      data: {
        expandable: true,
        expanded: true,
      },
    };

    const nextNodes: Node[] = nodes.map((node) => {
      if (selectedNodeIds.includes(node.id)) {
        return {
          ...node,
          position: {
            x: node.position.x - parentPosition.x + padding,
            y: node.position.y - parentPosition.y + padding,
          },
          extent: 'parent',
          parentNode: groupId,
        };
      }

      return node;
    });

    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
    setNodes([groupNode, ...nextNodes]);
  };

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <Button onClick={onGroup}>Group selected nodes</Button>
    </NodeToolbar>
  );
}
