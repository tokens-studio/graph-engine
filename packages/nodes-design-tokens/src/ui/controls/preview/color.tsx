import { Box, Text } from '@tokens-studio/ui';
import { toColor, toHex } from '@tokens-studio/graph-engine';
import React from 'react';


export const PreviewColor = ({ value }) => {
  if (value === undefined) {
    return <Text>Missing</Text>;
  }

  //Convert to hex
  const hex = toHex(toColor(value));

  return (
    <Box
      css={{
        border: '1px solid',
        borderColor: '$borderMuted',
        borderRadius: '$medium',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        width: '16px',
        height: '16px',
        flexShrink: '0',
      }}

    >
      <Box
        css={{
          background: hex,
          position: 'absolute',
          left: '-8px',
          top: '-8px',
          height: '64px',
          width: '64px',
          padding: 0,
          border: 'none',
          borderRadius: 0,
          outline: 'none',
        }}
      />
    </Box>
  );
};

export default PreviewColor;
