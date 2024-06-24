import { Box, Label, Stack, TextInput } from '@tokens-studio/ui';
import React from 'react';

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
      css={{ height: '100%', flex: 1, padding: '$3', overflow: 'auto' }}
    >
      <Box css={{ padding: '$3' }}>
        <Settings annotations={graph.annotations} />
      </Box>
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

const Settings = observer(({ annotations }: IAnnotation) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.getAttribute('data-key') as string;
    annotations[key] = e.target.value;
  };

  return (
    <Stack direction="column" gap={2}>
      {Object.entries(annotations).map(([key, val]) => (
        <Stack direction="column" gap={2}>
          <Label>{easyNameLookup(key)}</Label>
          <TextInput data-key={key} value={val} onChange={onChange} />
        </Stack>
      ))}
    </Stack>
  );
});
