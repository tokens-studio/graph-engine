import { Box, Stack, Text } from '@tokens-studio/ui';
import React from 'react';
import Color from 'colorjs.io';

function contrastingColor(value: string) {
    let black = new Color("srgb", [0, 0, 0]);
    let white = new Color("srgb", [1, 1, 1]);

    let background = new Color(value);
    let contrastBlack = Math.abs(background.contrast(black, "APCA"));
    let contrastWhite = Math.abs(background.contrast(white, "APCA"));

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
        <Stack direction='row' gap={0}>
            {colors.map(color =>
                <Box css={{display: 'grid', placeItems: 'center', minHeight: '100px', backgroundColor: color, padding: '$8'}}>
                    <Text css={{fontFamily: '$mono', fontSize: 'xx-large', color: contrastingColor(color)}}>{color}</Text>
                </Box>
            )}
        </Stack>
    )}
    </>
  );
};

export default ColorCompare;
