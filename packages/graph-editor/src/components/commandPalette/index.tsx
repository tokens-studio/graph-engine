import { Command } from 'cmdk';
import {
  DropPanelStore,
  PanelGroup,
  PanelItem,
} from '../panels/dropPanel/index.js';
import { Heading, Stack, Text } from '@tokens-studio/ui';
import { Node } from '@tokens-studio/graph-engine';
import { NodeRequest } from '@/editor/actions/createNode.js';
import { Node as ReactFlowNode, useReactFlow } from 'reactflow';
import { isActiveElementTextEditable } from '@/utils/isActiveElementTextEditable.js';
import { observer } from 'mobx-react-lite';
import { showNodesCmdPaletteSelector } from '@/redux/selectors/ui.js';
import { useDispatch, useSelector } from 'react-redux';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';
import React from 'react';
import Search from '@tokens-studio/icons/Search.js';
import styles from './index.module.css';
import useClickOutside from '@/hooks/useClickOutside.js';

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
          <div className={styles.icon}>{item.icon}</div>
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
          <Stack
            align="center"
            gap={2}
            style={{ color: 'var(--color-neutral-canvas-default-fg-subtle)' }}
          >
            {group.icon}
            {group.title}
          </Stack>
        }
      >
        {group.items.map((item) => (
          <CommandItem item={item} handleSelectItem={handleSelectItem} />
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

  const dialogRef = useClickOutside<HTMLDivElement>(() => {
    dispatch.ui.setShowNodesCmdPalette(!showNodesCmdPalette);
  }, showNodesCmdPalette);

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
      ref={dialogRef}
      open={showNodesCmdPalette}
      onOpenChange={() =>
        dispatch.ui.setShowNodesCmdPalette(!showNodesCmdPalette)
      }
      value={selectedItem}
      onValueChange={(value) => setSelectedItem(value)}
      label="Global Command Menu"
    >
      <div className={styles.searchContainer}>
        <Search />
        <Command.Input
          placeholder="Find nodes to add…"
          onKeyDown={handleKeyDown}
        />
      </div>
      <Command.List>
        <Command.Empty>
          <div className={styles.emptyState}>No nodes found.</div>
        </Command.Empty>
        <Stack direction="row" className={styles.scrollContainer}>
          <div className={styles.leftPanel}>
            {items.groups.map((value) => (
              <CommandMenuGroup
                key={value.key}
                handleSelectItem={handleSelectItem}
                group={value}
              />
            ))}
          </div>
          <div className={styles.rightPanel}>
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
          </div>
        </Stack>
      </Command.List>
    </Command.Dialog>
  );
};

function NodePreview({ title, description, docs }) {
  return (
    <Stack
      direction="column"
      justify="center"
      gap={3}
      className={styles.previewContainer}
    >
      <Stack direction="column" gap={5}>
        <Heading className={styles.previewTitle}>{title}</Heading>
      </Stack>
      <Text size="small" muted className={styles.previewDescription}>
        {description}
      </Text>
      {docs ? (
        <Text size="xsmall">
          <a href={docs} target="_blank" className={styles.link}>
            Read more
          </a>
        </Text>
      ) : null}
    </Stack>
  );
}

export { CommandMenu };
