import { Box, Scroll, Separator, Stack, TextInput } from '@tokens-studio/ui';
import React, { useEffect, useState } from 'react';
import { Accordion } from '../../accordion/index.tsx';
import { PanelItems, items } from './PanelItems.tsx';
import { DragItem } from './DragItem.tsx';
import { NodeEntry } from './NodeEntry.tsx';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { PlusIcon } from '@iconicicons/react';
import { Loading } from './Loading.tsx';
import { StyledPanel } from './StyledPanel.tsx';
import { StyledAccordingTrigger } from './StyledAccordionTrigger.tsx';
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
        newPanelItems.tokens = tokenSets.map((set) => ({ type: NodeTypes.SET, data: { tokens: [], urn: set.urn ?? '', title: set.name ?? '' }, icon: <PlusIcon />, text: set.name ?? '' }));
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
      return <Loading />;
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
            <Accordion.Item value={key}>
              <StyledAccordingTrigger>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Separator orientation="horizontal" />
              </StyledAccordingTrigger>
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
    <StyledPanel id="drop-panel">
      <Scroll height='100%'>
        <Stack direction="column" gap={1} css={{ width: '100%' }}>
          <Box css={{ padding: '$4' }}>
            <TextInput placeholder="Search" value={search} onChange={onSearch} />
          </Box>
          {accordionItems}
        </Stack>
      </Scroll>
    </StyledPanel>
  );
};

