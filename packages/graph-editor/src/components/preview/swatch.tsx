import { Text } from '@tokens-studio/ui/Text.js';
import { castToHex } from '@/utils/index.js';
import Color from 'colorjs.io';
import React, { useMemo } from 'react';

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

export const ColorSwatch = ({ value }) => {
  const color = useMemo(() => {
    try {
      return contrastingColor(castToHex(value));
    } catch (error) {
      return '';
    }
  }, [value]);
  const hex = useMemo(() => castToHex(value), [value]);

  return (
    <>
      {value && (
        <>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '100%',
              minHeight: '100px',
              backgroundColor: hex,
              padding: 'var(--component-spacing-xl)',
            }}
          >
            <Text style={{ font: 'var(--font-body-xl)', color }}>{hex}</Text>
          </div>
        </>
      )}
    </>
  );
};

export default ColorSwatch;
