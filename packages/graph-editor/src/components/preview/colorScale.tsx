import { Box, Text } from '@tokens-studio/ui';
import React from 'react';
import Color from 'colorjs.io';
import { toColor,  Color as ColorType } from '@tokens-studio/graph-engine';
import { castToHex } from '@/utils';

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

export const ColorScale = ({ scale }) => {

    return (
        <>
            {scale && (
                <>
                    {scale.map(color => {
                        const hex = castToHex(color)

                        return <Box css={{ display: 'grid', placeItems: 'center', width: '100%', minHeight: '100px', backgroundColor: hex }}>
                            <Text css={{ fontFamily: '$mono', fontSize: 'xx-large', color: contrastingColor(hex) }}>{hex}</Text>
                        </Box>
                    }

                    )}
                </>
            )}
        </>
    );
};

export default ColorScale;
