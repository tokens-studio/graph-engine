import { Box, Stack, Text } from '@tokens-studio/ui';
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
