import { Box, Text } from '@tokens-studio/ui';
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

export const ColorSwatch = ({ value }) => {

  return (
    <>
    {value && (
        <>
            <Box css={{display: 'grid', placeItems: 'center', width: '100%', minHeight: '100px', backgroundColor: value, padding: '$5'}}>
                <Text css={{fontFamily: '$mono', fontSize: '64px', color: contrastingColor(value)}}>{value}</Text>
            </Box>
        </>
    )}
    </>
  );
};

export default ColorSwatch;
