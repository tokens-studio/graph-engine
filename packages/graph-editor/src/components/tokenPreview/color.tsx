import { Text } from '@tokens-studio/ui';
import { styled } from '@/lib/stitches/index.js';
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

export const PreviewColor = ({ value }) => {
  if (value === undefined) {
    return <Text>Missing</Text>;
  }


  return (
    <StyledInputWrapper>
      <StyledDiv
        css={{
          background: value,
        }}
      />
    </StyledInputWrapper>
  );
};

export default PreviewColor;
