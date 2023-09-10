import {
  Item,
  Submenu,
} from 'react-contexify';

import React, { useEffect, useMemo, useState } from 'react';
import { PanelItems, items } from './PanelItems';
import { PlusIcon } from '@radix-ui/react-icons';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { useExternalData } from '#/context';

export function ContextMenuNodes({ onSelectItem }: { onSelectItem: (item: any) => void }) {
  const { tokenSets, loadingTokenSets } = useExternalData();
  const [panelItems, setPanelItems] = useState<PanelItems>(items);
  const [search, setSearch] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  const onInsertNode = React.useCallback(
    (type) => {
      console.log('insert node', type);
      
      onSelectItem({ type })
    },
    [onSelectItem],
  );


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

  if (loadingTokenSets) {
    return <div>Loading</div>;
  }

  const entries = Object.entries(panelItems).map(([key, values]) => {
    const filteredValues = values
      .filter((item) =>
        item.text.toLowerCase().includes(search.toLowerCase()),
      )
      .map((item) => (
        <Item
          key={item.text}
          onClick={() => onInsertNode(item.type)}
        >
          {item.icon}
          {item.text}
        </Item>
      ));

    if (filteredValues.length === 0) return null;

    return (
      <Submenu label={key.charAt(0).toUpperCase() + key.slice(1)}>
        {filteredValues}
      </Submenu>
    )
  })

  return (
    <>
    {entries}
    </>
  )
}
