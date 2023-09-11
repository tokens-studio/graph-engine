import { Button, Box, Text, Separator, Stack, TextInput, Heading, IconButton } from '@tokens-studio/ui';
import React, { useEffect, useState } from 'react';
import { Accordion } from '../../accordion/index.js';
import { PanelItems, items } from '../AddNodeDropdown/PanelItems.js';
import { DragItem } from './DragItem';
import { NodeEntry } from './NodeEntry';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon, PinTackIcon } from '@iconicicons/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { useExternalData } from '#/context/ExternalDataContext';
import { styled } from '#/lib/stitches/stitches.config.js';

const StyledAccordionTrigger = styled(Accordion.Trigger, {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  justifyContent: 'flex-start',
  width: '100%',
  padding: '$1 $3',
  borderRadius: '$small',
  cursor: 'pointer',
  '&:hover': {
    background: '$bgSubtle',
  },
});

const StyledAccordion = styled(Accordion, {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
});

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
      return <div>Loading</div>;
    }

    // todo: refactor to just use <details>/<summary>, no need for an accordion if were treating it like a regular expandable pattern
    return (
      <StyledAccordion type="multiple" defaultValue={defaultValue}>
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
              <StyledAccordionTrigger>
                <Box css={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '$fgSubtle', width: '24px', height: '24px'}}>
                  <TriangleDownIcon />
                  </Box>
                <Text size="xsmall" bold>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </StyledAccordionTrigger>
              <Accordion.Content>
                <Stack direction="column" css={{ padding: 0 }}>
                  {filteredValues}
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </StyledAccordion>
    );
  }, [loadingTokenSets, defaultValue, panelItems, search]);

  return (
    <Box css={{width: '100%', background: '$bgDefault', zIndex: 10, maxHeight: '100%', display: 'flex', flexDirection: 'column'}} id="drop-panel">
      <Stack direction="column" gap={3} css={{ paddingTop: '$1', width: '100%', overflowY: 'scroll' }}>
        <Stack direction="column" gap={2} css={{ padding: '0 $3', paddingTop: '$4' }}>
          <Text size="xsmall" bold>Nodes</Text>
          <TextInput placeholder="Search…" value={search} onChange={onSearch} />
        </Stack>
        <Stack direction="column" gap={2} css={{ padding: '$2' }}>
          {accordionItems}
        </Stack>
      </Stack>
    </Box>
  );
};

