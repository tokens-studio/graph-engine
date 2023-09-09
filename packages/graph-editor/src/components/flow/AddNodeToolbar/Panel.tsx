import { Box, IconButton, TextInput } from '@tokens-studio/ui';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { PanelItems, items } from './PanelItems.tsx';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { PlusIcon, ChevronRightIcon } from '@iconicicons/react';
import { useExternalData } from '#/context/ExternalDataContext.tsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled, keyframes } from '#/lib/stitches/stitches.config.ts';

export const AddNodetoolbar: React.FC<PropsWithChildren & { onSelectItem: (item: any) => void }> = ({ children, onSelectItem }) => {
  const { tokenSets, loadingTokenSets } = useExternalData();
  const [panelItems, setPanelItems] = useState<PanelItems>(items);
  const [search, setSearch] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState<string[]>(['generic']);
  const [addNodeVisible, setAddNodeIsVisible] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleToggleAddNodeVisible = () => {
    if (addNodeVisible) {
      setAddNodeIsVisible(false);
    } else {
      setAddNodeIsVisible(true);
      setSearchVisible(false);
    }
  };

  const handleToggleSearch = () => {
    if (searchVisible) {
      setSearchVisible(false);
    } else {
      setSearchVisible(true);
      setAddNodeIsVisible(false);
    }
  };

  useEffect(() => {
    if (tokenSets) {
      setPanelItems((prev) => {
        const newPanelItems = { ...prev };
        newPanelItems.tokens = tokenSets.map((set) => ({
          type: NodeTypes.SET,
          data: { identifier: set.identifier, title: set.name },
          icon: <PlusIcon />,
          text: set.name,
        }));
        return newPanelItems;
      });
    } else {
    }
  }, [tokenSets]);

  useEffect(() => {
    console.log('Panel items changed', panelItems);
  }, [panelItems]);

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setDefaultValue(['generic']);
    } else {
      setDefaultValue(Object.keys(panelItems));
    }
  };

  const onInsertNode = React.useCallback(
    (type) => {
      onSelectItem({ type })
    },
    [onSelectItem],
  );

  const handleOnOpenChange = (open) => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const availableNodes = React.useMemo(() => {
    if (loadingTokenSets) {
      return <div>Loading</div>;
    }

    return Object.entries(panelItems).map(([key, values]) => {
          const filteredValues = values
            .filter((item) =>
              item.text.toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => (
              <DropdownMenuItem
                key={item.text}
                onSelect={() => onInsertNode(item.type)}
              >
                <DropdownMenuItemIcon>{item.icon}</DropdownMenuItemIcon>
                {item.text}
              </DropdownMenuItem>
            ));

      if (filteredValues.length === 0) return null;

          return (
            <DropdownMenu.Sub>
              <DropdownMenuSubTrigger>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <RightSlot>
                  <ChevronRightIcon />
                </RightSlot>

              </DropdownMenuSubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenuSubContent className="DropdownMenuContent">
                  {filteredValues}
                </DropdownMenuSubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
      )
    }
    );
  }, [loadingTokenSets, panelItems, search, onInsertNode]);

  return (
    <DropdownMenu.Root onOpenChange={handleOnOpenChange}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          css={{ flexShrink: 0 }}
          icon={<PlusIcon />}
          variant="invisible"
          tooltip="Add new node"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenuContent sideOffset={4} className="DropdownMenuContent">
          <Box css={{ padding: '$2' }}><TextInput ref={searchInputRef} value={search} onChange={onSearch} placeholder="Search" onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()} /></Box>
          {availableNodes}
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const contentStyles = {
  minWidth: 220,
  backgroundColor: '$bgDefault',
  borderRadius: '$medium',
  padding: '$2',
  border: '1px solid $borderSubtle',
  boxShadow: '$contextMenu',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
};

const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  color: '$fgMuted',
  '[data-highlighted] > &': { color: '$fgDefault' },
  '[data-disabled] &': { color: '$fgDisabled' },
});

const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);
const DropdownMenuSubContent = styled(DropdownMenu.SubContent, contentStyles);

const itemStyles = {
  all: 'unset',
  fontSize: '$xsmall',
  lineHeight: 1,
  color: '$fgDefault',
  borderRadius: '$small',
  display: 'flex',
  alignItems: 'center',
  padding: '0 $4',
  height: '32px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$fgDisabled',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$bgSubtle',
    color: '$fgDefault',
  },
};

export const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuItemIcon = styled('div', {
  display: 'flex',
  width: '24px',
  height: '24px',
  fontSize: '$xxsmall',
  marginRight: '$3',
  color: '$fgSubtle',
  userSelect: 'none',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
});
const DropdownMenuSubTrigger = styled(DropdownMenu.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: '$bgSubtle',
    color: '$fgDefault',
  },
  ...itemStyles,
});

