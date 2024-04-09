import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import { Command } from 'cmdk';
import React from 'react';
import {
  DropPanelStore,
  PanelGroup,
  PanelItem,
} from '../panels/dropPanel/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { showNodesCmdPaletteSelector } from '@/redux/selectors/ui';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { styled } from '@/lib/stitches';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';

export interface ICommandMenu {
  reactFlowWrapper: React.MutableRefObject<HTMLDivElement | null>;
  items: DropPanelStore;
  handleSelectNewNodeType: (node: { type: NodeTypes }) => void;
}

const CommandItem = observer(
  ({
    item,
    handleSelectItem,
  }: {
    item: PanelItem;
    handleSelectItem: (PanelItem) => void;
  }) => {
    return (
      <Command.Item
        key={item.type}
        onSelect={() => handleSelectItem(item)}
        value={item.text.toLowerCase()}
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
    );
  },
);

const CommandMenuGroup = observer(
  ({
    group,
    handleSelectItem,
  }: {
    group: PanelGroup;
    handleSelectItem: (PanelItem) => void;
  }) => {
    return (
      <Command.Group key={group.key} heading={group.title}>
        {group.items.map((item) => (
          <CommandItem item={item} handleSelectItem={handleSelectItem} />
        ))}
      </Command.Group>
    );
  },
);

const CommandMenu = ({
  reactFlowWrapper,
  items,
  handleSelectNewNodeType,
}: ICommandMenu) => {
  const showNodesCmdPalette = useSelector(showNodesCmdPaletteSelector);
  const dispatch = useDispatch();
  const cursorPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const [selectedItem, setSelectedItem] = React.useState('input');

  const wrapperBounds = reactFlowWrapper.current?.getBoundingClientRect();

  const handleSelectItem = (item) => {
    handleSelectNewNodeType({
      position: cursorPositionRef.current,
      ...item,
    });
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
          padding: '$4',
          borderBottom: '1px solid $borderSubtle',
        }}
      >
        <MagnifyingGlassIcon />
        <Command.Input placeholder="Find nodes to add…" />
      </Box>
      <Command.List>
        <Command.Empty>
          <Box css={{ padding: '$4' }}>No nodes found.</Box>
        </Command.Empty>
        <Stack
          direction="row"
          css={{ overflowY: 'scroll', maxHeight: '450px' }}
        >
          <Box
            css={{
              width: '50%',
              padding: '$4',
            }}
          >
            {items.groups.map((value) => (
              <CommandMenuGroup
                key={value.key}
                handleSelectItem={handleSelectItem}
                group={value}
              />
            ))}
          </Box>
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              margin: '$5',
              width: '50%',
              background: '$bgCanvas',
              borderRadius: '$medium',
              position: 'sticky',
              top: '$5',
            }}
          >
            {items.groups.map((value) =>
              value.items.map(
                (item) =>
                  selectedItem === item.text.toLowerCase() && (
                    <NodePreview
                      key={item.type}
                      title={item.text}
                      description={item.description}
                      docs={item.docs}
                    />
                  ),
              ),
            )}
          </Box>
        </Stack>
      </Command.List>
    </Command.Dialog>
  );
};

function NodePreview({ title, description, docs }) {
  return (
    <Stack direction="column" justify="center" gap={3} css={{ padding: '$6' }}>
      <Stack direction="column" gap={5}>
        <Heading
          css={{
            fontSize: '$small',
            fontWeight: '$sansMedium',
            color: '$fgDefault',
          }}
        >
          {title}
        </Heading>
      </Stack>
      <Text size="small" muted css={{ lineHeight: '150%' }}>
        {description}
      </Text>
      {docs ? (
        <Text size="xsmall">
          <StyledLink href={docs} target="_blank">
            Read more
          </StyledLink>
        </Text>
      ) : null}
    </Stack>
  );
}

const StyledLink = styled('a', {
  color: '$accentDefault',
  textDecoration: 'none',
  fontWeight: '$sansMedium',
});

export { CommandMenu };
