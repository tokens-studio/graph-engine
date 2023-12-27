import { SearchIcon } from '@iconicicons/react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { Command } from 'cmdk';
import React, { useCallback } from 'react';
import { store } from '@/redux/store.tsx';
import { usePreviewContext } from '@/providers/preview.tsx';
import { examples } from '../examples/examples.tsx';
import { IExample } from '../types/IExample.tsx';
import { GraphFile } from '@/types/file.ts';

const ExamplesPicker = ({ open, onClose, loadExample }) => {
  const handleSelectItem = (example: IExample) => {
    loadExample(example.file);
    onClose();
  };

  return <></>;

  return (
    <Command.Dialog
      open={open}
      label="Load an example"
      onOpenChange={() => onClose()}
    >
      <Box
        css={{
          color: '$fgSubtle',
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          marginBottom: '$3',
          padding: '0 $4',
        }}
      >
        <SearchIcon />
        <Command.Input placeholder="Find an example to load…" />
      </Box>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {examples.map((example) => (
          <Command.Item
            key={example.key}
            value={example.key}
            onSelect={() => handleSelectItem(example)}
          >
            <Stack direction="column" gap={2} align="start">
              <Text css={{ fontWeight: '$sansMedium', fontSize: '$xsmall' }}>
                {example.title}
              </Text>
              <Text css={{ color: '$fgMuted', fontSize: '$xxsmall' }}>
                {example.description}
              </Text>
            </Stack>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
};

export { ExamplesPicker };
