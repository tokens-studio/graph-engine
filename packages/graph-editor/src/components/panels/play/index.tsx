import { Box } from '@tokens-studio/ui/Box.js';
import { PlayControls } from '@/components/toolbar/groups/playControls.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import React from 'react';

export function PlayPanel() {
  return (
    <Box
      css={{
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        gap={4}
        css={{ height: '100%', flex: 1, padding: '$3' }}
      >
        <PlayControls />
      </Stack>
    </Box>
  );
}
