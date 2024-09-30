import { Box } from '@tokens-studio/ui/Box.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { Text } from '@tokens-studio/ui/Text.js';
import React from 'react';

export const NodeEntry = ({
  icon,
  text,
}: {
  icon?: React.ReactNode | string;
  text: string;
}) => {
  return (
    <Stack
      direction="row"
      gap={2}
      justify="start"
      align="center"
      css={{ paddingLeft: '$3', height: '24px' }}
    >
      {icon && (
        <Box
          css={{
            color: '$fgSubtle',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '$xxsmall',
          }}
        >
          {icon}
        </Box>
      )}

      <Text
        size="xsmall"
        css={{
          color: '$fgMuted',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {text}
      </Text>
    </Stack>
  );
};
