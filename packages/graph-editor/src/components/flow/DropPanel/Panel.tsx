import { Box, Separator, Spinner, Stack, TextInput } from '@tokens-studio/ui';
import { styled } from '#/lib/stitches/index.ts';
import React, { useEffect, useState } from 'react';
import { Accordion } from '../../accordion/index.tsx';
import { PanelItems, panelItems } from './PanelItems.tsx';
import { DragItem } from './DragItem.tsx';
import { NodeEntry } from './NodeEntry.tsx';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { EditorProps } from '#/editor/editorTypes.ts';
import { PlusIcon } from '@iconicicons/react';
import { Loading } from './Loading.tsx';
import { StyledPanel } from './StyledPanel.tsx';
import { StyledAccordingTrigger } from './StyledAccordionTrigger.tsx';

interface DropPanelProps {
  loadTokenSets?: EditorProps['loadTokenSets']
}

export const DropPanel = ({ loadTokenSets }: DropPanelProps) => {
  const [items, setItems] = useState<PanelItems>(panelItems)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState<string[]>([
    'generic',
  ]);

  useEffect(() => {
    const getTokenSets = async () => {
      if (loadTokenSets) {
        setLoading(true)
        const sets = await loadTokenSets();
        setItems((prev) => {
          prev.tokens = sets.map((set) => ({ type: NodeTypes.INLINE_SET, data: { tokens: [] }, icon: <PlusIcon />, text: set.name }));
          return prev
        })
        setLoading(false)
      }
    }

    getTokenSets()

  }, [loadTokenSets])

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setDefaultValue(['generic']);
    } else {
      setDefaultValue(Object.keys(items));
    }
  };

  const accordionItems = loading ? <Loading /> : (
    <Accordion
      type="multiple"
      defaultValue={defaultValue}
    >
      {Object.entries(items).map(([key, values]) => {
        const filteredValues = values
          .filter((item) =>
            item.text.toLowerCase().includes(search.toLowerCase()),
          )
          .map((item) => (
            //@ts-ignore
            <DragItem type={item.type} data={item.data || null} key={item.key}>
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
  )

  return (
    <StyledPanel id="drop-panel">
      <Stack direction="column" gap={1} css={{ width: '100%' }}>
        <Box css={{ padding: '$4' }}>
          <TextInput placeholder="Search" value={search} onChange={onSearch} />
        </Box>
        {accordionItems}
      </Stack>
    </StyledPanel>
  );
};

