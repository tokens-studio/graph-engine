import { Button, Box, Scroll, Separator, Stack, TextInput } from '@tokens-studio/ui';
import React, { useEffect, useState } from 'react';
import { Accordion } from '../../accordion/index.js';
import { PanelItems, items } from '../AddNodeToolbar/PanelItems';
import { DragItem } from '../AddNodeToolbar/DragItem';
import { NodeEntry } from './NodeEntry.js';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@iconicicons/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { useExternalData } from '#/context/ExternalDataContext.tsx';


export const DropPanel = () => {
  const { tokenSets, loadingTokenSets } = useExternalData();
  const [panelItems, setPanelItems] = useState<PanelItems>(items)
  const [search, setSearch] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState<string[]>([
    'generic',
  ]);

  useEffect(() => {
    if (tokenSets) {
      setPanelItems((prev) => {
        const newPanelItems = { ...prev };
        newPanelItems.tokens = tokenSets.map((set) => ({ type: NodeTypes.SET, data: { identifier: set.identifier, title: set.name }, icon: <PlusIcon />, text: set.name }));
        return newPanelItems
      })
    }

  }, [tokenSets])

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setDefaultValue(['generic']);
    } else {
      setDefaultValue(Object.keys(panelItems));
    }
  };

  const accordionItems = React.useMemo(() => {
    if (loadingTokenSets) {
      return <div>Loadng</div>;
    }

    return (
      <Accordion type="multiple" defaultValue={defaultValue}>
        {Object.entries(panelItems).map(([key, values]) => {
          const filteredValues = values
            .filter((item) =>
              item.text.toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => (
              <DragItem
                type={item.type}
                data={item.data || null}
                key={item.text}
              >
                <NodeEntry icon={item.icon} text={item.text} />
              </DragItem>
            ));

          if (filteredValues.length === 0) return null;

          return (
            <Accordion.Item value={key} key={key}>
              <Stack direction="row" css={{}}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Box css={{color: '$fgSubtle'}}><TriangleDownIcon /></Box>
              </Stack>
              <Accordion.Content>
                <Stack direction="column" css={{ padding: 0 }} gap={1}>
                  {filteredValues}
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  }, [loadingTokenSets, defaultValue, panelItems, search]);

  return (
    <Box css={{position: 'fixed', top: '40px', border: '1px solid $borderMuted', borderRadius: '$medium', left: '$3', background: '$bgDefault', zIndex: 10, maxHeight: '80vh', display: 'flex', flexDirection: 'column'}} id="drop-panel">
      <Scroll height='100%'>
        <Stack direction="column" gap={1} css={{ paddingTop: '$4', width: '100%', paddingRight: '$3' }}>
          <Box css={{ padding: '$1 $3' }}>
            <TextInput placeholder="Search" value={search} onChange={onSearch} />
          </Box>
          <Box css={{ padding: '$2 $2' }}>
            {accordionItems}
          </Box>
        </Stack>
      </Scroll>
    </Box>
  );
};

