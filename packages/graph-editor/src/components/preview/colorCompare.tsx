import { Box, Stack, Text } from '@tokens-studio/ui';
import React from 'react';
import Color from 'colorjs.io';
import { castToHex } from '@/utils';

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
        let black = new Color("srgb", [0, 0, 0]);
        let white = new Color("srgb", [1, 1, 1]);
    
        let background = new Color(value);
        let contrastBlack = Math.abs(background.contrast(black, "APCA"));
        let contrastWhite = Math.abs(background.contrast(white, "APCA"));
    
        return contrastBlack > contrastWhite ? '#000000' : '#ffffff';
      } catch (error) {
        console.error("Error calculating contrasting color:", error);
        return '#000000'; // Default to black text if there's an error
      }
}

export const ColorCompare = ({ colors }) => {

  return (
    <>
    {colors && (
        <Stack direction='row' gap={0}>
            {colors.map(color =>{

              const col = castToHex(color)
              return <Box css={{ display: 'grid', placeItems: 'center', minHeight: '100px', backgroundColor: col, padding: '$8', width: '100%' }}>
                <Text css={{ fontFamily: '$mono', fontSize: 'xx-large', color: contrastingColor(col) }}>{col}</Text>
              </Box> 
            }
            )}
        </Stack>
    )}
    </>
  );
};

export default ColorCompare;
