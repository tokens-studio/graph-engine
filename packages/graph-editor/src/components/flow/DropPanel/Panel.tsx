/* eslint-disable react/display-name */
import { Box, Scroll, Separator, Stack, TextInput } from '@tokens-studio/ui';
import React, { useImperativeHandle, useState } from 'react';
import { Accordion } from '../../accordion/index.tsx';
import { PanelGroup } from './PanelItems.tsx';
import { DragItem } from './DragItem.tsx';
import { NodeEntry } from './NodeEntry.tsx';
import { StyledPanel } from './StyledPanel.tsx';
import { StyledAccordingTrigger } from './StyledAccordionTrigger.tsx';

export type ImperativeDropPanelRef = {
  /**
   * Sets the currently opened groups by key
   */
  setGroups: (groups: string[]) => void;
};

export interface IDropPanel {
  /**
   * The currently opened groups by key
   */
  groups: string[];
  /**
   * Items to display
   */
  items: PanelGroup[];
}

export const DropPanel = React.forwardRef<ImperativeDropPanelRef, IDropPanel>(
  (props: IDropPanel, ref) => {
    const { groups = [], items = [] } = props;
    const [thePanelItems, setPanelItems] = useState<PanelGroup[]>(items);
    const [search, setSearch] = React.useState('');
    const [defaultValue, setDefaultValue] = React.useState<string[]>(groups);

    useImperativeHandle(
      ref,
      () => ({
        setGroups: (groups) => {
          setDefaultValue(groups);
        },
      }),
      [],
    );

    const onSearch = (e) => {
      setSearch(e.target.value);
      if (e.target.value === '') {
        setDefaultValue([]);
      } else {
        setDefaultValue(Object.keys(thePanelItems));
      }
    };

    const accordionItems = React.useMemo(() => {
      return (
        <Accordion type="multiple" defaultValue={defaultValue}>
          {thePanelItems.map((value) => {
            const filteredValues = value.items
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

            return (
              <Accordion.Item value={value.key} key={value.key}>
                <StyledAccordingTrigger>
                  {value.title}
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
    }, [defaultValue, thePanelItems, search]);

    return (
      <StyledPanel id="drop-panel">
        <Scroll height="100%">
          <Stack direction="column" gap={1} css={{ width: '100%' }}>
            <Box css={{ padding: '$4' }}>
              <TextInput
                placeholder="Search"
                value={search}
                onChange={onSearch}
              />
            </Box>
            {accordionItems}
          </Stack>
        </Scroll>
      </StyledPanel>
    );
  },
);
