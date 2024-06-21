import { Box, Stack, Text } from '@tokens-studio/ui';
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

export const ColorCompare = ({ colors }) => {
  return (
    <>
      {colors && (
        <Stack direction="row" gap={0}>
          {colors.map((color) => (
            <Box
              css={{
                display: 'grid',
                placeItems: 'center',
                minHeight: '100px',
                backgroundColor: color,
                padding: '$8',
                width: '100%',
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
        </Stack>
      )}
    </>
  );
};

export default ColorCompare;
