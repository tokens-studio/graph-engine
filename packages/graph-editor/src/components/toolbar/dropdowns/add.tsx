import React, { RefObject } from 'react';
import {
  Box,
  Button,
  DropdownMenu,
  Stack,
  Text
} from '@tokens-studio/ui';
import { Plus, NavArrowRight } from 'iconoir-react';
import { useSelector } from 'react-redux';
import { panelItemsSelector } from '@/redux/selectors';
import { useReactFlow } from 'reactflow';
import { useAction } from '@/editor/actions/provider';
import { useDispatch } from '@/hooks';

export const AddDropdown = () => {
  const data = useSelector(panelItemsSelector);
  const createNode = useAction('createNode');
  const reactFlowInstance = useReactFlow();
  const dispatch = useDispatch();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const wrapperRefs = React.useMemo(() => {
    return data.groups.reduce((acc, group) => {
      group.items.forEach(item => {
        acc[item.type] = React.createRef();
      });
      return acc;
    }, {});
  }, [data.groups]);

  const openQuickSearch = React.useCallback(
    () => {
      dispatch.ui.setShowNodesCmdPalette(true);
    },
    [dispatch.ui],
  )

  const addNode = (type: string) => {
    const position = {
      x: 0,
      y: 0,
    };

    if (wrapperRefs[type].current) {
      const { x, y } = wrapperRefs[type].current.getBoundingClientRect();
      position.x = x;
      position.y = y;
    }

    const newNode = {
      type,
      position: reactFlowInstance.screenToFlowPosition(position),
    };

    createNode(newNode)
  }

  const nodes = React.useMemo(() => {
    return data.groups.map(group => {

      return (
        <DropdownMenu.Sub key={group.key}>
          <DropdownMenu.SubTrigger>
            <Stack gap={3} align='center'>
              {group.icon}
              {group.title}
            </Stack>
            <DropdownMenu.TrailingVisual>
              <NavArrowRight />
            </DropdownMenu.TrailingVisual>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              {group.items.map(item => (
                <DropdownMenu.Item key={item.type} ref={wrapperRefs[item.type]} onSelect={() => addNode(item.type)}>
                  {item.text}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      )

    })
  }, [data]);

  return (
    <Box ref={wrapperRef}>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant='primary'>
            <Plus />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content css={{ minWidth: '200px' }}>
            <DropdownMenu.Item onSelect={openQuickSearch}>
              Quick Search ..
              <DropdownMenu.TrailingVisual>
                ⇧K
              </DropdownMenu.TrailingVisual>
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

            {nodes}

          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Box>
  );
};
