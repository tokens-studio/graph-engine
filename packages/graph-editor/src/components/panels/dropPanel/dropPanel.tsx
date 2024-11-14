import { Accordion, Stack, Text, TextInput } from '@tokens-studio/ui';
import { DragItem } from './DragItem.js';
import { DropPanelStore } from './data.js';
import { IconoirProvider, NavArrowRight } from 'iconoir-react';
import { NodeEntry } from './NodeEntry.js';
import { observer } from 'mobx-react-lite';
import { panelItemsSelector } from '@/redux/selectors/registry.js';
import { styled } from '@/lib/stitches/index.js';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

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
  boxSizing: 'border-box',
});

const StyledChevron = styled(NavArrowRight, {
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

export const DropPanel = () => {
  const data = useSelector(panelItemsSelector);
  return <DropPanelInner data={data} />;
};

export const DropPanelInner = observer(({ data }: IDropPanel) => {
  const [search, setSearch] = React.useState('');
  const [opened, setOpened] = useState<string[]>([]);

  const onSearch = (e) => {
    setSearch(e.target.value);

    if (!e.target.value) {
      setOpened([]);
    } else {
      setOpened(data.groups.map((group) => group.key));
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
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
        style={{
          paddingTop: 'var(--component-spacing-xs)',
          width: '100%',
          flex: 1,
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          direction="column"
          gap={2}
          style={{ padding: '0 var(--component-spacing-md)', paddingTop: 'var(--component-spacing-lg)' }}
        >
          <TextInput placeholder="Search…" value={search} onChange={onSearch} />
        </Stack>
        <StyledAccordion
          type="multiple"
          defaultValue={[]}
          value={opened}
          onValueChange={setOpened}
        >
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
                  <Stack
                    align="center"
                    justify="between"
                    width="full"
                    style={{ padding: 'var(--component-spacing-md) 0' }}
                  >
                    <IconoirProvider
                      iconProps={{ width: '0.875em', height: '0.875em' }}
                    >
                      <Stack gap={3} align="center">
                        {value.icon}
                        <Text size="xsmall" bold style={{ textAlign: 'left' }}>
                          {value.title}
                        </Text>
                      </Stack>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 'var(--size-250)',
                        }}
                      >
                        <StyledChevron />
                      </div>
                    </IconoirProvider>
                  </Stack>
                </StyledAccordionTrigger>
                <Accordion.Content>
                  <Stack
                    direction="column"
                    style={{ padding: 0, marginBottom: 'var(--component-spacing-lg)' }}
                  >
                    {filteredValues}
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </StyledAccordion>
      </Stack>
    </div>
  );
});
