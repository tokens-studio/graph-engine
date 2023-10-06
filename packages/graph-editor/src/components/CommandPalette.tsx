import { SearchIcon } from '@iconicicons/react';
import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import { Command } from 'cmdk';
import React from 'react';
import { PanelGroup, PanelItem } from './flow/DropPanel/PanelItems';
import { useDispatch, useSelector } from 'react-redux';
import { showNodesCmdPaletteSelector } from '#/redux/selectors/ui';
import { useEditor } from './flow/hooks/useEditor';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { styled } from '#/lib/stitches';

export interface ICommandMenu {
  reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
  items: PanelGroup[];
  handleSelectNewNodeType: (node: { type: NodeTypes }) => void;
}

const CommandMenu = ({
  reactFlowWrapper,
  items,
  handleSelectNewNodeType,
}: ICommandMenu) => {
  const showNodesCmdPalette = useSelector(showNodesCmdPaletteSelector);
  const dispatch = useDispatch();
  const cursorPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const [selectedItem, setSelectedItem] = React.useState('input')

  const wrapperBounds = reactFlowWrapper.current?.getBoundingClientRect();

  const handleSelectItem = (item: NodeTypes) => {
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
      if (e.key === 'K' && e.shiftKey) {
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
      value={selectedItem}
      onValueChange={(value) => setSelectedItem(value)}
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
        <Stack direction="row">
          <Box css={{
            width: '50%',
          }}>
            {items.map((value) => {
              const childValues = value.items.map((item) => (
                <Command.Item
                  key={item.type}
                  onSelect={() => handleSelectItem(item.type)}
                  value={item.type}
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
                <Command.Group heading={value.title}>{childValues}</Command.Group>
              );
            })}
          </Box>
          <Box css={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '$3',
              width: '50%',
          }}>
            {items.map((value) => value.items.map((item) => selectedItem === item.type && <NodePreview title={item.text} description={item.description} docs={item.docs} />))}
          </Box>
        </Stack>
      </Command.List>
    </Command.Dialog>
  );
};

function NodePreview({ title, description, docs }) {
  return (
    <Stack direction="column" justify='center' gap={3} css={{position: 'sticky', top: 0, padding: '$6'}}>
      <Stack direction="column" gap={5}>
        <Heading css={{
          fontSize: '$small',
          fontWeight: '$sansMedium',
          color: '$fgDefault',
        }}>{title}</Heading>
        </Stack>
        <Text size="small" muted css={{lineHeight: '150%'}}>{description}</Text>
      {docs ? <Text size="xsmall"><StyledLink href={docs} target="_blank">Read more</StyledLink></Text> : null}
    </Stack>
  );
}

const StyledLink = styled('a', {
  color: '$accentDefault',
  textDecoration: 'none',
  fontWeight: '$sansMedium'
});

export { CommandMenu };
