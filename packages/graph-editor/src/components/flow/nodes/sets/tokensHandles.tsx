import React from 'react';
import { getToolTipData } from './utils/getTooltipData';
import { getNodeValue } from './utils/getNodeValue';
import { Box, Stack } from '@tokens-studio/ui';
import PreviewToken from '../../preview/token';
import { Handle } from '../../handles';

export const TokenSetHandles = ({ tokens }) => {
  if (!tokens) {
    return null;
  }

  return tokens
    .filter((x) => !!x)
    .map((token) => {
      return (
        <Stack
          direction="row"
          css={{ width: '100%' }}
          key={token.name}
          align="center"
        >
          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              flexGrow: 1,
              alignItems: 'center',
              gap: '$2',
              overflow: 'hidden',
              width: '100%',
              paddingLeft: '$3',
            }}
          >
            <PreviewToken token={token} />
          </Box>
          <Handle id={token.name}>
            <Box
              title={getToolTipData(token)}
              css={{
                fontFamily: 'monospace',
                fontSize: '$xsmall',
                color: '$fgSubtle',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '200px',
                textOverflow: 'ellipsis',
              }}
            >
              {getNodeValue(token)}
            </Box>
          </Handle>
        </Stack>
      );
    });
};
