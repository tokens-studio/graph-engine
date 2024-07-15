import { Button, DropdownMenu, Stack, Tooltip } from '@tokens-studio/ui';
import { NavArrowRight, Plus } from 'iconoir-react';
import { panelItemsSelector } from '@/redux/selectors/registry.js';
import { useAction } from '@/editor/actions/provider.js';
import { useDispatch } from '@/hooks/index.js';
import { useReactFlow } from 'reactflow';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export const AddDropdown = () => {
  const data = useSelector(panelItemsSelector);
  const createNode = useAction('createNode');
  const reactFlowInstance = useReactFlow();
  const dispatch = useDispatch();
  const mousePositionRef = React.useRef({ x: 0, y: 0 });
  const selectAddedNodes = useSelectAddedNodes();

  const onDropdownOpenChange = useCallback((isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const openQuickSearch = useCallback(() => {
    // Quick search window does not get the focus if open from a dropdown item, hence the setTimeout
    setTimeout(() => {
      dispatch.ui.setShowNodesCmdPalette(true);
    });
  }, [dispatch.ui]);

  const addNode = useCallback(
    (type: string) => {
      const newNode = {
        type,
        position: reactFlowInstance.screenToFlowPosition(
          mousePositionRef.current,
        ),
      };

      const node = createNode(newNode);

      if (node) {
        selectAddedNodes([node.flowNode]);
      }
    },
    [reactFlowInstance, createNode, selectAddedNodes],
  );

  const nodes = React.useMemo(() => {
    return data.groups.map((group) => {
      return (
        <DropdownMenu.Sub key={group.key}>
          <DropdownMenu.SubTrigger>
            <Stack gap={3} align="center">
              {group.icon}
              {group.title}
            </Stack>
            <DropdownMenu.TrailingVisual>
              <NavArrowRight />
            </DropdownMenu.TrailingVisual>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              {group.items.map((item) => (
                <DropdownMenu.Item
                  key={item.type}
                  onSelect={() => addNode(item.type)}
                >
                  {item.text}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      );
    });
  }, [data, addNode]);

  return (
    <DropdownMenu onOpenChange={onDropdownOpenChange}>
      <Tooltip label="Add node" side="bottom">
        <DropdownMenu.Trigger asChild>
          <Button variant="primary">
            <Plus />
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={{ minWidth: '200px' }}>
          <DropdownMenu.Item onSelect={openQuickSearch}>
            Quick Search...
            <DropdownMenu.TrailingVisual>⇧K</DropdownMenu.TrailingVisual>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {nodes}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
