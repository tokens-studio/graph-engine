import { Box, Stack } from '@tokens-studio/ui';
import { PreviewColor } from './color.tsx';
import { TokenType } from '#/utils/index.ts';
import { styled } from '#/lib/stitches/index.ts';
import React from 'react';

const StyledInputWrapper = styled('div', {
  border: '1px solid',
  borderColor: '$borderMuted',
  borderRadius: '$medium',
  overflow: 'hidden',
  display: 'flex',
  position: 'relative',
  width: '16px',
  height: '16px',
  flexShrink: '0',
});

const StyledDiv = styled('div', {
  position: 'absolute',
  left: '-8px',
  top: '-8px',
  height: '64px',
  width: '64px',
  padding: 0,
  border: 'none',
  borderRadius: 0,
  outline: 'none',
});

const getPreview = (tokenData) => {
  switch (tokenData.type) {
    case TokenType.color:
      return <PreviewColor value={tokenData.value} />;
    default:
      return null;
  }
};

type PreviewProps = {
  token: any;
  hideName?: boolean;
};

export const PreviewToken = ({ token, hideName }: PreviewProps) => (
  <Stack direction="row" gap={3}>
    {getPreview(token)}
    {!hideName && (
      <Box
        css={{
          fontWeight: '$sansRegular',
          fontFamily: 'monospace',
          fontSize: '$xsmall',
          color: '$fgMuted',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        title={token.name}
      >
        {token.name || 'No name'}
      </Box>
    )}
  </Stack>
);

export default PreviewToken;
