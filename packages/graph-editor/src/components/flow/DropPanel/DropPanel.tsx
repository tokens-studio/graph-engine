/* eslint-disable react/display-name */
import { Box, Text, Stack, TextInput, Scroll } from '@tokens-studio/ui';
import React, { useImperativeHandle, useState } from 'react';
import { Accordion } from '../../accordion/index.js';
import { PanelGroup } from './PanelItems.js';
import { DragItem } from './DragItem';
import { NodeEntry } from './NodeEntry';
import { TriangleRightIcon } from '@radix-ui/react-icons';
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

const StyledChevron = styled(TriangleRightIcon, {
  transition: 'all ease 0.3s',
  '[data-state="open"] &': {
    transform: 'rotate(90deg)',
  },
});

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
      // todo: refactor to just use <details>/<summary>, no need for an accordion if were treating it like a regular expandable pattern
      return (
        <StyledAccordion type="multiple" defaultValue={defaultValue}>
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
                <StyledAccordionTrigger>
                  <Box
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '$fgSubtle',
                      width: '24px',
                      height: '24px',
                    }}
                  >
                    <StyledChevron />
                  </Box>
                  <Text size="xsmall" bold>
                    {value.title}
                  </Text>
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
    }, [defaultValue, thePanelItems, search]);

    return (
      <Box
        css={{
          width: '100%',
          background: '$bgDefault',
          zIndex: 10,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        id="drop-panel"
      >
        <Scroll height="100%">
          <Stack
            direction="column"
            gap={3}
            css={{ paddingTop: '$1', width: '100%' }}
          >
            <Stack
              direction="column"
              gap={2}
              css={{ padding: '0 $3', paddingTop: '$4' }}
            >
              <Text size="xsmall" bold>
                Nodes
              </Text>
              <TextInput
                placeholder="Search…"
                value={search}
                onChange={onSearch}
              />
            </Stack>
            <Stack direction="column" gap={2} css={{ padding: '$2' }}>
              {accordionItems}
            </Stack>
          </Stack>
        </Scroll>
      </Box>
    );
  },
);
