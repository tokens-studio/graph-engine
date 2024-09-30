import { Box } from '@tokens-studio/ui/Box.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { Text } from '@tokens-studio/ui/Text.js';
import { castToHex } from '@/utils/index.js';
import Color from 'colorjs.io';
import React from 'react';

function isValidColor(value: string): boolean {
  try {
    new Color(value);
    return true;
  } catch {
    return false;
  }
}

function contrastingColor(value: string) {
  if (!isValidColor(value)) {
    return '#000000'; // Default to black text if color is invalid
  }

  try {
    const black = new Color('srgb', [0, 0, 0]);
    const white = new Color('srgb', [1, 1, 1]);

    const background = new Color(value);
    const contrastBlack = Math.abs(background.contrast(black, 'APCA'));
    const contrastWhite = Math.abs(background.contrast(white, 'APCA'));

    return contrastBlack > contrastWhite ? '#000000' : '#ffffff';
  } catch (error) {
    console.error('Error calculating contrasting color:', error);
    return '#000000'; // Default to black text if there's an error
  }
}

export const ColorCompare = ({ colors }) => {
  return (
    <>
      {colors && (
        <Stack direction="row" gap={0}>
          {colors.map((color) => {
            const col = castToHex(color);
            return (
              <Box
                css={{
                  display: 'grid',
                  placeItems: 'center',
                  minHeight: '100px',
                  backgroundColor: col,
                  padding: '$8',
                  width: '100%',
                }}
              >
                <Text
                  css={{
                    fontFamily: '$mono',
                    fontSize: 'xx-large',
                    color: contrastingColor(col),
                  }}
                >
                  {col}
                </Text>
              </Box>
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default ColorCompare;
