import { PlayControls } from '@/components/toolbar/groups/playControls.js';
import { Stack } from '@tokens-studio/ui';
import React from 'react';

export function PlayPanel() {
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
    >
      <Stack
        direction="row"
        gap={4}
        style={{
          height: '100%',
          flex: 1,
          padding: 'var(--component-spacing-md)',
        }}
      >
        <PlayControls />
      </Stack>
    </div>
  );
}
