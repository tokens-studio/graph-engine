import { Accordion, Stack, TextInput } from '@tokens-studio/ui';
import { DragItem } from './DragItem.js';
import { DropPanelStore } from './data.js';
import { observer } from 'mobx-react-lite';
import { useFrame } from '@/system/frame/hook.js';
import NavArrowRight from '@tokens-studio/icons/NavArrowRight.js';
import React, { useState } from 'react';
import styles from './dropPanel.module.css';

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
  const frame = useFrame();
  return <DropPanelInner data={frame.panelItems} />;
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
    <div className={styles.container} id="drop-panel">
      <Stack direction="column" gap={3} className={styles.vertical}>
        <Stack direction="column" gap={2} className={styles.search}>
          <TextInput placeholder="Search…" value={search} onChange={onSearch} />
        </Stack>
        <Accordion type="multiple" value={opened} onValueChange={setOpened}>
          {data.groups.map((value) => {
            const filteredValues = value.items
              .filter((item) =>
                item.text.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                <DragItem
                  type={item.type}
                  icon={item.icon}
                  data={item.data || null}
                  key={item.text}
                  docs={item.docs}
                  description={item.description}
                  title={item.text}
                />
              ));

            if (filteredValues.length === 0) {
              return <></>;
            }

            return (
              <Accordion.Item value={value.key} key={value.key}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  <div className={styles.accordionTriggerIcon}>
                    {value.icon}
                  </div>
                  <div className={styles.accordionTriggerTitle}>
                    {value.title}
                  </div>
                  <NavArrowRight className={styles.chevron} />
                </Accordion.Trigger>
                <Accordion.Content>
                  <Stack direction="column">{filteredValues}</Stack>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Stack>
    </div>
  );
});
