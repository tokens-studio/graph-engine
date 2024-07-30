import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import { Command } from 'cmdk';
import {
  DropPanelStore,
  PanelGroup,
  PanelItem,
} from '../panels/dropPanel/index.js';
import { Node } from '@tokens-studio/graph-engine';
import { NodeRequest } from '@/editor/actions/createNode.js';
import { Node as ReactFlowNode, useReactFlow } from 'reactflow';
import { Search } from 'iconoir-react';
import { isActiveElementTextEditable } from '@/utils/isActiveElementTextEditable.js';
import { observer } from 'mobx-react-lite';
import { showNodesCmdPaletteSelector } from '@/redux/selectors/ui.js';
import { styled } from '@/lib/stitches/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';
import React from 'react';

export interface ICommandMenu {
  items: DropPanelStore;
  handleSelectNewNodeType: (node: NodeRequest) =>
    | {
      graphNode: Node;
      flowNode: ReactFlowNode;
    }
    | undefined;
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
              color: '$fgMuted',
              width: '12px',
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
      <Command.Group
        key={group.key}
        heading={
          <Stack align="center" gap={2} css={{ margin: '$3 0 $2' }}>
            {group.icon}
            <Text size="small" css={{ fontWeight: '$sansMedium' }}>
              {group.title}
            </Text>
          </Stack>
        }
      >
        {group.items.map((item) => (
          <CommandItem key={item.type} item={item} handleSelectItem={handleSelectItem} />
        ))}
      </Command.Group>
    );
  },
);

const CommandMenu = ({ items, handleSelectNewNodeType }: ICommandMenu) => {
  const showNodesCmdPalette = useSelector(showNodesCmdPaletteSelector);
  const dispatch = useDispatch();
  const cursorPositionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedItem, setSelectedItem] = React.useState('input');
  const reactflow = useReactFlow();
  const selectAddedNodes = useSelectAddedNodes();

  const handleSelectItem = (item) => {
    const newNode = handleSelectNewNodeType({
      position: reactflow.screenToFlowPosition(cursorPositionRef.current),
      ...item,
    });
    if (newNode) {
      selectAddedNodes([newNode.flowNode]);
    }

    dispatch.ui.setShowNodesCmdPalette(false);
  };

  // Store the mouse cursor position when the mouse is moved
  React.useEffect(() => {
    const move = (e) => {
      cursorPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, []);

  // Toggle the menu when shift + K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'K' && e.shiftKey && !isActiveElementTextEditable()) {
        e.preventDefault();

        dispatch.ui.setNodeInsertPosition(cursorPositionRef.current);
        dispatch.ui.setShowNodesCmdPalette(!showNodesCmdPalette);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [dispatch.ui, showNodesCmdPalette]);

  // Close the menu when Escape key is pressed inside the input
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();

      dispatch.ui.setShowNodesCmdPalette(false);
    }
  };

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
          color: '$fgDefault',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          padding: '$4',
          borderBottom: '1px solid $borderSubtle',
        }}
      >
        <Search />
        <Command.Input
          placeholder="Find nodes to add…"
          onKeyDown={handleKeyDown}
        />
      </Box>
      <Command.List>
        <Command.Empty>
          <Box css={{ padding: '$4' }}>No nodes found.</Box>
        </Command.Empty>
        <Stack
          direction="row"
          css={{
            overflowY: 'scroll',
            maxHeight: '500px',
            scrollbarColor: 'var(--colors-bgSubtle) transparent',
            scrollbarWidth: 'thin',
          }}
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
