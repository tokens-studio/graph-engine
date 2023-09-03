import {
  Box,
  DropdownMenu,
  IconButton,
  Stack
} from '@tokens-studio/ui';
import React from 'react';
import { DropPanel } from './DropPanel';

export function ActionToolbar() {
  return (<Box css={{ padding: '$3', position: 'relative', top: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Stack direction="column" justify="start" align="start" gap={1} css={{ pointerEvents: 'auto', backgroundColor: '$bgDefault', border: '1px solid $borderSubtle', borderRadius: '$medium' }}>
      <DropPanel />
    </Stack>
  </Box>
  );
}
