import { Box } from '@tokens-studio/ui';
import React from 'react';

export function NodeValue({
  text,
  tooltip,
  dynamic,
}: {
  text: string | number;
  tooltip?: string;
  dynamic?: boolean;
}) {
  return (
    <Box
      title={tooltip}
      css={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '$xxsmall',
        fontFamily: 'ui-monospace',
        letterSpacing: '-0.03em',
        display: 'inline-flex',
        borderRadius: '$small',
        backgroundColor: dynamic ? '$accentBg' : 'transparent',
        color: dynamic ? '$accentEmphasis' : '$fgMuted',
        padding: '$1 $2',
      }}
    >
      {text}
    </Box>
  );
}
