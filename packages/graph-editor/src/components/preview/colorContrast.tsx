import { Box, Text } from '@tokens-studio/ui';
import { castToHex } from '@/utils/index.js';
import Color from 'colorjs.io';
import React from 'react';

function contrastingColor(
  background: Color,
  contrastAlgorithm: string = 'APCA',
) {
  const contrastBlack = Math.abs(
    background.contrast(new Color('#ffffff'), contrastAlgorithm),
  );
  const contrastWhite = Math.abs(
    background.contrast(new Color('#000000'), contrastAlgorithm),
  );

  if (contrastBlack > contrastWhite) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}
export const ColorContrast = ({ value }) => {
  const col = castToHex(value);
  return (
    <>
      {value && (
        <>
          <Box
            css={{
              display: 'grid',
              placeItems: 'center',
              width: '100%',
              minHeight: '100px',
              backgroundColor: col,
            }}
          >
            <Text
              css={{
                fontFamily: '$mono',
                fontSize: 'xx-large',
                color: contrastingColor(value),
              }}
            >
              {col}
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default ColorContrast;
