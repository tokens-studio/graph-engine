import { Text } from '@tokens-studio/ui/Text.js';
import { castToHex } from '../../utils/index.js';
import { observer } from 'mobx-react-lite';
import Color from 'colorjs.io';
import ColorScale from '../../nodes/colorScale.js';
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


export const ColorScalePreview = observer(({ inputs }: { inputs: ColorScale["inputs"] }) => {
  return (
    <>
      {inputs.scale && (
        <>
          {inputs.scale.value.map((color) => {
            const hex = castToHex(color);

            return (
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '100%',
                  minHeight: '100px',
                  backgroundColor: hex,
                }}
              >
                <Text
                  style={{
                    font: 'var(--font-body-xl)',
                    color: contrastingColor(hex),
                  }}
                >
                  {hex}
                </Text>
              </div>
            );
          })}
        </>
      )}
    </>
  );
});

export default ColorScalePreview;