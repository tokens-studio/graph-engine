import { ALIGNMENT, align, distribute } from '@/components/panels/index.js';
import {
  AlignHorizontalCenters,
  AlignHorizontalSpacing,
  AlignVerticalSpacing,
  CompAlignBottom,
  CompAlignLeft,
  CompAlignRight,
  CompAlignTop,
} from 'iconoir-react';
import { DropdownMenu, IconButton, Tooltip } from '@tokens-studio/ui';
import { Node } from 'reactflow';
import { graphEditorSelector } from '@/redux/selectors/index.js';
import { useSelector } from 'react-redux';
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

export const AlignDropdown = () => {
  const graphEditor = useSelector(graphEditorSelector);
  const updateNodes = handleChange(graphEditor);

  return (
    <DropdownMenu>
      <Tooltip label="Align and distribute" side="bottom">
        <DropdownMenu.Trigger asChild>
          <IconButton
            variant="invisible"
            style={{ paddingLeft: '0', paddingRight: '0' }}
            icon={<AlignHorizontalCenters />}
          />
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={{ minWidth: '200px' }}>
          <DropdownMenu.Item
            onSelect={() => updateNodes(align(ALIGNMENT.START))}
          >
            <DropdownMenu.LeadingVisual>
              <CompAlignLeft />
            </DropdownMenu.LeadingVisual>
            Align Left
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => updateNodes(align(ALIGNMENT.CENTER))}
          >
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

          <DropdownMenu.Item
            onSelect={() => updateNodes(align(ALIGNMENT.START, 'y'))}
          >
            <DropdownMenu.LeadingVisual>
              <CompAlignTop />
            </DropdownMenu.LeadingVisual>
            Align Top
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => updateNodes(align(ALIGNMENT.CENTER, 'y'))}
          >
            <DropdownMenu.LeadingVisual>
              <AlignHorizontalCenters />
            </DropdownMenu.LeadingVisual>
            Align Center
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => updateNodes(align(ALIGNMENT.END, 'y'))}
          >
            <DropdownMenu.LeadingVisual>
              <CompAlignBottom />
            </DropdownMenu.LeadingVisual>
            Align Bottom
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onSelect={() => updateNodes(distribute(ALIGNMENT.CENTER))}
          >
            <DropdownMenu.LeadingVisual>
              <AlignHorizontalSpacing />
            </DropdownMenu.LeadingVisual>
            Distribute Horizontally
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => updateNodes(distribute(ALIGNMENT.CENTER, 'y'))}
          >
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
