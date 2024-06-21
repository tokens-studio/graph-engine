import { Box, Text } from '@tokens-studio/ui';
import Color from 'colorjs.io';
import React from 'react';

function contrastingColor(
  text: string,
  background: string,
  contrastAlgorithm: string = 'APCA',
) {
  const textColor = new Color(text);

  const backgroundColor = new Color(background);
  const contrastBlack = Math.abs(
    backgroundColor.contrast(textColor, contrastAlgorithm),
  );

  if (contrastBlack > contrastWhite) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

export const ColorSwatch = ({ value }) => {
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
                color: contrastingColor(value),
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

export default ColorSwatch;
