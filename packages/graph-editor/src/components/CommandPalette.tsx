import { SearchIcon } from '@iconicicons/react';
import { Box, Stack } from '@tokens-studio/ui';
import { Command } from 'cmdk';
import React from 'react';
import { PanelItems, items } from './flow/PanelItems';
import { useDispatch, useSelector } from 'react-redux';
import { showNodesCmdPaletteSelector } from '#/redux/selectors/ui';
import { useEditor } from './flow/hooks/useEditor';
import { useReactFlow } from 'reactflow';

const CommandMenu = ({
  reactFlowWrapper,
}: {
  reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const showNodesCmdPalette = useSelector(showNodesCmdPaletteSelector);
  const dispatch = useDispatch();
  const cursorPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const { handleSelectNewNodeType } = useEditor();
  const reactFlowInstance = useReactFlow();

  const wrapperBounds = reactFlowWrapper.current?.getBoundingClientRect();

  const handleSelectItem = (item: PanelItems) => {
    handleSelectNewNodeType({ type: item });
    dispatch.ui.setShowNodesCmdPalette(false);
  };

  // Store the mouse cursor position when the mouse is moved
  React.useEffect(() => {
    const move = (e) => {
      if (wrapperBounds) {
        cursorPositionRef.current = {
          x: e.clientX - wrapperBounds!.left,
          y: e.clientY - wrapperBounds!.top,
        };
      }
    };

    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, [wrapperBounds]);

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'I' && e.shiftKey) {
        e.preventDefault();

        dispatch.ui.setNodeInsertPosition(cursorPositionRef.current);
        dispatch.ui.setShowNodesCmdPalette(!showNodesCmdPalette);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [dispatch.ui, showNodesCmdPalette]);

  return (
    <Command.Dialog
      open={showNodesCmdPalette}
      onOpenChange={() =>
        dispatch.ui.setShowNodesCmdPalette(!showNodesCmdPalette)
      }
      label="Global Command Menu"
    >
      <Box
        css={{
          color: '$fgSubtle',
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          marginBottom: '$3',
          padding: '0 $4',
        }}
      >
        <SearchIcon />
        <Command.Input placeholder="Find nodes to add…" />
      </Box>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {Object.entries(items).map(([key, values]) => {
          const childValues = values.map((item) => (
            <Command.Item
              key={item.text}
              onSelect={() => handleSelectItem(item.type)}
            >
              <Stack direction="row" gap={2} align="center">
                <Box
                  css={{
                    fontSize: '$xxsmall',
                    color: '$fgSubtle',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                {item.text}
              </Stack>
            </Command.Item>
          ));
          return (
            <Command.Group heading={key.charAt(0).toUpperCase() + key.slice(1)}>
              {childValues}
            </Command.Group>
          );
        })}
      </Command.List>
    </Command.Dialog>
  );
};

export { CommandMenu };
