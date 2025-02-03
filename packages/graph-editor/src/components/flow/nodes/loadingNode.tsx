import { Spinner, Stack, Text } from '@tokens-studio/ui';
import NodeWrapper from '../wrapper/base.js';
import React from 'react';

export const LoadingNode = ({ id }) => {
  console.log('loadingNode');
  return (
    <NodeWrapper id={id} title="loading...">
      <Stack
        direction="column"
        gap={2}
        align="center"
        style={{ padding: 'var(--component-spacing-2xl)' }}
      >
        <Spinner />
        <Text>Loading...</Text>
      </Stack>
    </NodeWrapper>
  );
};
