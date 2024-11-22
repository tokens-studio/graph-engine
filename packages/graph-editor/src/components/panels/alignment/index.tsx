import {
  AlignHorizontalCentersSolid,
  AlignVerticalCentersSolid,
  CompAlignBottomSolid,
  CompAlignLeftSolid,
  CompAlignRightSolid,
  CompAlignTopSolid,
} from 'iconoir-react';
import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import { Node } from 'reactflow';
import { graphEditorSelector } from '@/redux/selectors/index.js';
import { useSelector } from 'react-redux';
import AlignHorizontalCenters from '@tokens-studio/icons/AlignHorizontalCenters.js';
import AlignVerticalCenters from '@tokens-studio/icons/AlignVerticalCenters.js';
import CompAlignBottom from '@tokens-studio/icons/CompAlignBottom.js';
import CompAlignLeft from '@tokens-studio/icons/CompAlignLeft.js';
import CompAlignRight from '@tokens-studio/icons/CompAlignRight.js';
import CompAlignTop from '@tokens-studio/icons/CompAlignTop.js';
import React from 'react';

const partitionSelectedNodes = (nodes: Node[]) => {
  return nodes.reduce(
    (acc, node) => {
      if (node.selected) {
        acc.selectedNodes.push(node);
      } else {
        acc.unselectedNodes.push(node);
      }

      return acc;
    },
    {
      selectedNodes: [] as Node[],
      unselectedNodes: [] as Node[],
    },
  );
};

const handleChange = (graphEditor) => (updater) => {
  const currentFlow = graphEditor?.getFlow();
  if (!currentFlow) return;
  const { selectedNodes, unselectedNodes } = partitionSelectedNodes(
    currentFlow.getNodes(),
  );
  //Assume it changes it directly
  updater(selectedNodes);
  //Make sure unselected nodes are processed first for cases like groups
  currentFlow.setNodes([...unselectedNodes, ...selectedNodes]);
};

export enum ALIGNMENT {
  START = 0,
  CENTER = 1,
  END = 2,
}

export const align =
  (align: ALIGNMENT, prop = 'x') =>
  (selectedNodes) => {
    // Align selected nodes to the left
    let v = 0;
    switch (align) {
      case ALIGNMENT.START:
        v = Math.min(...selectedNodes.map((node) => node.position[prop]));
        break;
      case ALIGNMENT.CENTER: {
        const vmin = Math.min(
          ...selectedNodes.map((node) => node.position[prop]),
        );
        const vmax = Math.max(
          ...selectedNodes.map((node) => node.position[prop]),
        );
        v = (vmin + vmax) / 2;
        break;
      }
      default:
        v = Math.max(...selectedNodes.map((node) => node.position[prop]));
    }
    selectedNodes.forEach((node) => {
      node.position[prop] = v;
    });
  };

export const distribute =
  (align: ALIGNMENT, prop = 'x') =>
  (selectedNodes) => {
    if (selectedNodes.length < 3) {
      return;
    }

    //Sort the nodes by position
    selectedNodes = [...selectedNodes].sort(
      (a, b) => a.position[prop] - b.position[prop],
    );

    const getLength = (node) => {
      if (prop === 'x') {
        return node.width;
      }
      return node.height;
    };

    const getPos = (node) => {
      switch (align) {
        case ALIGNMENT.START:
          return node.position[prop];
        case ALIGNMENT.CENTER:
          return node.position[prop] + getLength(node) / 2;
        default:
          return node.position[prop] + getLength(node);
      }
    };

    const startNode = selectedNodes.reduce((acc, node) => {
      return getPos(node) < getPos(acc) ? node : acc;
    }, selectedNodes[0]);

    const endNode = selectedNodes.reduce((acc, node) => {
      return getPos(node) > getPos(acc) ? node : acc;
    }, selectedNodes[0]);

    //Get the total length
    const incrementLength =
      (getPos(endNode) - getPos(startNode)) / (selectedNodes.length - 1);

    selectedNodes.forEach((node, i) => {
      node.position[prop] = startNode.position[prop] + i * incrementLength;
    });
  };

export function AlignmentPanel() {
  const graphEditor = useSelector(graphEditorSelector);
  const updateNodes = handleChange(graphEditor);

  return (
    <Box
      css={{
        height: '100%',
        width: '100%',
        flex: 1,
        padding: '$2',
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack gap={2} direction="column">
        <Text size="small">Align</Text>
        <Stack direction="row" gap={4} css={{ height: '100%', flex: 1 }}>
          <IconButton
            title="Align X Left"
            onClick={() => updateNodes(align(ALIGNMENT.START))}
            icon={<CompAlignLeft />}
          />
          <IconButton
            title="Align X Center"
            onClick={() => updateNodes(align(ALIGNMENT.CENTER))}
            icon={<AlignHorizontalCenters />}
          />
          <IconButton
            title="Align X Right"
            onClick={() => updateNodes(align(ALIGNMENT.END))}
            icon={<CompAlignRight />}
          />

          <IconButton
            title="Align Y Top"
            onClick={() => updateNodes(align(ALIGNMENT.START, 'y'))}
            icon={<CompAlignTop />}
          />
          <IconButton
            title="Align Y Middle"
            onClick={() => updateNodes(align(ALIGNMENT.CENTER, 'y'))}
            icon={<AlignVerticalCenters />}
          />
          <IconButton
            title="Align Y Bottom"
            onClick={() => updateNodes(align(ALIGNMENT.END, 'y'))}
            icon={<CompAlignBottom />}
          />
        </Stack>
        <Text size="small">Distribute</Text>
        <Stack direction="row" gap={4} css={{ height: '100%', flex: 1 }}>
          <IconButton
            title="Distribute horizontally left"
            onClick={() => updateNodes(distribute(ALIGNMENT.START))}
            icon={<CompAlignLeftSolid />}
          />
          <IconButton
            title="Distribute horizontally center"
            onClick={() => updateNodes(distribute(ALIGNMENT.CENTER))}
            icon={<AlignHorizontalCentersSolid />}
          />
          <IconButton
            title="Distribute horizontally right"
            onClick={() => updateNodes(distribute(ALIGNMENT.END))}
            icon={<CompAlignRightSolid />}
          />
          <IconButton
            title="Distribute vertically top"
            onClick={() => updateNodes(distribute(ALIGNMENT.START, 'y'))}
            icon={<CompAlignTopSolid />}
          />
          <IconButton
            title="Distribute vertically center"
            onClick={() => updateNodes(distribute(ALIGNMENT.CENTER, 'y'))}
            icon={<AlignVerticalCentersSolid />}
          />
          <IconButton
            title="Distribute vertically bottom"
            onClick={() => updateNodes(distribute(ALIGNMENT.END, 'y'))}
            icon={<CompAlignBottomSolid />}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
