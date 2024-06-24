import { Box, Text } from '@tokens-studio/ui';
import Color from 'colorjs.io';
import React from 'react';

function contrastingColor(
  text: string,
  background: string,
  contrastAlgorithm = 'APCA',
) {
  const textColor = new Color(text);

  const backgroundColor = new Color(background);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contrastBlack = Math.abs(
    backgroundColor.contrast(textColor, contrastAlgorithm),
  );

  // FIXME: contrastWhite is undefined???
  // if (contrastBlack > contrastWhite) {
  return '#000000';
  // } else {
  //  return '#ffffff';
  // }
}

export const ColorContrast = ({ value }) => {
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
              backgroundColor: value,
            }}
          >
            <Text
              css={{
                fontFamily: '$mono',
                fontSize: 'xx-large',
                // FIXME: this isn't right either, 2nd argument was missing so I just prefilled with black to make lint/types happy
                color: contrastingColor(value, '#000000'),
              }}
            >
              {value}
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default ColorContrast;
