import { Box, Text } from '@tokens-studio/ui';
import Color from 'colorjs.io';
import React from 'react';

function contrastingColor(value: string) {
  const black = new Color('srgb', [0, 0, 0]);
  const white = new Color('srgb', [1, 1, 1]);

  const background = new Color(value);
  const contrastBlack = Math.abs(background.contrast(black, 'APCA'));
  const contrastWhite = Math.abs(background.contrast(white, 'APCA'));

  if (contrastBlack > contrastWhite) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

export const ColorScale = ({ scale }) => {
  return (
    <>
      {scale && (
        <>
          {scale.map((color) => (
            <Box
              css={{
                display: 'grid',
                placeItems: 'center',
                width: '100%',
                minHeight: '100px',
                backgroundColor: color,
              }}
            >
              <Text
                css={{
                  fontFamily: '$mono',
                  fontSize: 'xx-large',
                  color: contrastingColor(color),
                }}
              >
                {color}
              </Text>
            </Box>
          ))}
        </>
      )}
    </>
  );
};

export default ColorScale;
