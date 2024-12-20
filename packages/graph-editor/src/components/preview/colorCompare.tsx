import { Stack, Text } from '@tokens-studio/ui';
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
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  minHeight: '100px',
                  backgroundColor: col,
                  padding: 'var(--component-spacing-2xl)',
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    font: 'var(--font-body-xl)',
                    color: contrastingColor(col),
                  }}
                >
                  {col}
                </Text>
              </div>
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default ColorCompare;
