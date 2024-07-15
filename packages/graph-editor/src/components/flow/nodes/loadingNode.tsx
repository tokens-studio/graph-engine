import { Spinner, Stack, Text } from '@tokens-studio/ui';
import NodeWrapper from '../wrapper/base.js';
import React from 'react';

export const LoadingNode = ({ id }) => {
  return (
    <NodeWrapper id={id} title="loading...">
      <Stack direction="column" gap={2} align="center" css={{ padding: '$6' }}>
        <Spinner />
        <Text>Loading...</Text>
      </Stack>
    </NodeWrapper>
  );
};
