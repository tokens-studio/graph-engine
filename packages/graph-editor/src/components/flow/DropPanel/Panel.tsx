import { Button, Box, Scroll, Separator, Stack, TextInput } from '@tokens-studio/ui';
import React, { useEffect, useState } from 'react';
import { Accordion } from '../../accordion/index.tsx';
import { PanelItems, items } from './PanelItems.tsx';
import { DragItem } from './DragItem.tsx';
import { NodeEntry } from './NodeEntry.tsx';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@iconicicons/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
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
  const [isVisible, setIsVisible] = useState(true);

  const handleToggleVisible = () => {
    setIsVisible(!isVisible);
  };

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
            <Accordion.Item value={key} key={key}>
              <StyledAccordingTrigger>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <Box css={{color: '$fgSubtle'}}><TriangleDownIcon /></Box>
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
      <Stack css={{borderBottom: '1px solid', borderBottomColor: isVisible ? '$borderSubtle' : 'transparent'}}>
        <Button css={{flexGrow: 1, flexShrink: 0}} size="small" onClick={handleToggleVisible} icon={<PlusIcon />} variant="invisible">
          Add new node
          {isVisible ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </Button>
      </Stack>
      {isVisible &&
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
      }
    </StyledPanel>
  );
};

