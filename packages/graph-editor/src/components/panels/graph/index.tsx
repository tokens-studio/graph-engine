import { IconButton, Label, Stack, TextInput } from '@tokens-studio/ui';
import React, { useState } from 'react';

import { FloppyDisk } from 'iconoir-react';
import { JSONTree } from 'react-json-tree';
import { description, title } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';

export function GraphPanel() {
  const graph = useGraph();

  if (!graph) {
    return <></>;
  }

  return (
    <Stack
      direction="column"
      gap={4}
      style={{ height: '100%', flex: 1, padding: 'var(--component-spacing-md)', overflow: 'auto' }}
    >
      <div style={{ padding: 'var(--component-spacing-md)' }}>
        <Settings annotations={graph.annotations} />
      </div>
    </Stack>
  );
}

interface IAnnotation {
  annotations: Record<string, string>;
}

const easyNameLookup = (name) => {
  switch (name) {
    case 'engine.id':
      return 'Graph ID';
    case title:
      return 'Title';
    case description:
      return 'Description';
    default:
      return name;
  }
};

const SettingsField = observer(
  ({
    name,
    val,
    onSave,
  }: {
    name: string;
    val: unknown;
    onSave: (string, unknown) => void;
  }) => {
    const [value, setValue] = useState(val);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    const onClick = () => onSave(name, value);

    return (
      <Stack direction="column" gap={2}>
        <Label>{easyNameLookup(name)}</Label>
        <Stack direction="row" gap={2}>
          {typeof val === 'object' ? (
            <JSONTree data={val} />
          ) : (
            <>
              <TextInput value={val as string} onChange={onChange} />
              <IconButton onClick={onClick} icon={<FloppyDisk />} />
            </>
          )}
        </Stack>
      </Stack>
    );
  },
);

const Settings = observer(({ annotations }: IAnnotation) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (key: string, val: any) => {
    annotations[key] = val;
  };

  return (
    <Stack direction="column" gap={2}>
      {Object.entries(annotations).map(([key, val]) => {
        return <SettingsField name={key} val={val} onSave={onChange} />;
      })}
    </Stack>
  );
});
