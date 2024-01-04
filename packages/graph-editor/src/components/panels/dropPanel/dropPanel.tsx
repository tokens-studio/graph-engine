/* eslint-disable react/display-name */
import { Box, Text, Stack, TextInput, Accordion } from '@tokens-studio/ui';
import React from 'react';
import { DropPanelStore } from './data.js';
import { DragItem } from './DragItem.js';
import { NodeEntry } from './NodeEntry.js';
import { styled } from '@/lib/stitches/stitches.config.js';
import { observer } from 'mobx-react-lite';
import { ChevronRightIcon } from '@radix-ui/react-icons';

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
  padding: '$2',
});

const StyledChevron = styled(ChevronRightIcon, {
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
   * Items to display
   */
  data: DropPanelStore;
}

export const DropPanel = observer(({ data }: IDropPanel) => {
  const [search, setSearch] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState<string[]>([]);

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setDefaultValue([]);
    } else {
      setDefaultValue(data.groups.map((value) => value.key));
    }
  };

  return (
    <Box
      css={{
        height: '100%',
        width: '100%',
        background: '$bgDefault',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
      id="drop-panel"
    >
      <Stack
        direction="column"
        gap={3}
        css={{ paddingTop: '$1', width: '100%', flex: 1, overflow: 'auto' }}
      >
        <Stack
          direction="column"
          gap={2}
          css={{ padding: '0 $5', paddingTop: '$4' }}
        >
          <TextInput placeholder="Search…" value={search} onChange={onSearch} />
        </Stack>
        <StyledAccordion type="multiple" defaultValue={[]}>
          {data.groups.map((value) => {
            const filteredValues = value.items
              .filter((item) =>
                item.text.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                <DragItem
                  type={item.type}
                  data={item.data || null}
                  key={item.text}
                  docs={item.docs}
                  description={item.description}
                  title={item.text}
                  icon={item.icon}
                >
                  <NodeEntry icon={item.icon} text={item.text} />
                </DragItem>
              ));

            if (filteredValues.length === 0) {
              return <></>;
            }

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
                  <Stack
                    direction="column"
                    css={{ padding: 0, marginBottom: '$4' }}
                  >
                    {filteredValues}
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </StyledAccordion>
      </Stack>
    </Box>
  );
});
