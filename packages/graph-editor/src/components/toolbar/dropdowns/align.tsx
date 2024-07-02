import React from 'react';
import {
  Button,
  DropdownMenu,
  Text,
  Tooltip
} from '@tokens-studio/ui';
import { AlignHorizontalCenters, CompAlignLeft, CompAlignRight, CompAlignTop, CompAlignBottom, NavArrowRight, AlignHorizontalSpacing, AlignVerticalSpacing } from 'iconoir-react';
import { useSelector } from 'react-redux';
import { graphEditorSelector } from '@/redux/selectors';
import { Node } from 'reactflow';

const partitionSelectedNodes = (nodes: Node[]) => {
  return nodes.reduce((acc, node) => {

    if (node.selected) {
      acc.selectedNodes.push(node);
    } else {
      acc.unselectedNodes.push(node);
    }

    return acc;

  }, {
    selectedNodes: [] as Node[],
    unselectedNodes: [] as Node[]
  })
}

const handleChange = (graphEditor) => (updater) => {
  const currentFlow = graphEditor?.getFlow();
  if (!currentFlow) return;
  const { selectedNodes, unselectedNodes } = partitionSelectedNodes(currentFlow.getNodes());
  //Assume it changes it directly
  updater(selectedNodes);
  //Make sure unselected nodes are processed first for cases like groups
  currentFlow.setNodes([...unselectedNodes, ...selectedNodes]);
}

export enum ALIGNMENT {
  START = 0,
  CENTER = 1,
  END = 2
}

const align = (align: ALIGNMENT, prop = 'x') => (selectedNodes) => {
  // Align selected nodes to the left
  let v = 0;
  switch (align) {
    case ALIGNMENT.START:
      v = Math.min(...selectedNodes.map(node => node.position[prop]));
      break;
    case ALIGNMENT.CENTER:
      let vmin = Math.min(...selectedNodes.map(node => node.position[prop]));
      let vmax = Math.max(...selectedNodes.map(node => node.position[prop]));
      v = (vmin + vmax) / 2;
      break;
    default:
      v = Math.max(...selectedNodes.map(node => node.position[prop]));
  }
  selectedNodes.forEach(node => {
    node.position[prop] = v;
  });
}

const distribute = (align: ALIGNMENT, prop = 'x') => (selectedNodes) => {

  if (selectedNodes.length < 3) {
    return;
  }

  //Sort the nodes by position
  selectedNodes = [...selectedNodes].sort((a, b) => a.position[prop] - b.position[prop]);

  const getLength = (node) => {

    if (prop === 'x') {
      return node.width;
    }
    return node.height;
  }

  const getPos = (node) => {
    switch (align) {
      case ALIGNMENT.START:
        return node.position[prop];
      case ALIGNMENT.CENTER:
        return node.position[prop] + getLength(node) / 2;
      default:
        return node.position[prop] + getLength(node);
    }
  }

  let startNode = selectedNodes.reduce((acc, node) => {
    return getPos(node) < getPos(acc) ? node : acc;
  }, selectedNodes[0]);

  let endNode = selectedNodes.reduce((acc, node) => {
    return getPos(node) > getPos(acc) ? node : acc;
  }, selectedNodes[0]);


  //Get the total length
  let incrementLength = (getPos(endNode) - getPos(startNode)) / (selectedNodes.length - 1);

  selectedNodes.forEach((node, i) => {
    node.position[prop] = startNode.position[prop] + i * incrementLength;
  });
}

export const AlignDropdown = () => {
  const graphEditor = useSelector(graphEditorSelector);
  const updateNodes = handleChange(graphEditor);

  return (
    <DropdownMenu>
      <Tooltip label="Align and distribute" side="bottom">
        <DropdownMenu.Trigger asChild>
          <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
            <AlignHorizontalCenters />
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={{ minWidth: '200px' }}>
          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.START))}>
            <DropdownMenu.LeadingVisual>
              <CompAlignLeft />
            </DropdownMenu.LeadingVisual>
            Align Left
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.CENTER))}>
            <DropdownMenu.LeadingVisual>
              <AlignHorizontalCenters />
            </DropdownMenu.LeadingVisual>
            Align Center
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.END))}>
            <DropdownMenu.LeadingVisual>
              <CompAlignRight />
            </DropdownMenu.LeadingVisual>
            Align Right
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.START, 'y'))}>
            <DropdownMenu.LeadingVisual>
              <CompAlignTop />
            </DropdownMenu.LeadingVisual>
            Align Top
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.CENTER, 'y'))}>
            <DropdownMenu.LeadingVisual>
              <AlignHorizontalCenters />
            </DropdownMenu.LeadingVisual>
            Align Center
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => updateNodes(align(ALIGNMENT.END, 'y'))}>
            <DropdownMenu.LeadingVisual>
              <CompAlignBottom />
            </DropdownMenu.LeadingVisual>
            Align Bottom
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onSelect={() => updateNodes(distribute(ALIGNMENT.CENTER))}>
            <DropdownMenu.LeadingVisual>
              <AlignHorizontalSpacing />
            </DropdownMenu.LeadingVisual>
            Distribute Horizontally
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => updateNodes(distribute(ALIGNMENT.CENTER, 'y'))}>
            <DropdownMenu.LeadingVisual>
              <AlignVerticalSpacing />
            </DropdownMenu.LeadingVisual>
            Distribute Vertically
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
