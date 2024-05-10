import {
    grayDark,
    sandDark,
    amberDark,
    crimsonDark,
    pinkDark,
    purpleDark,
    violetDark,
    indigoDark,
    tealDark,
    limeDark,
    mintDark,
    blueDark,
    redDark,
    greenDark,
  } from '@radix-ui/colors';
import { CSS as StitchesCSS, createStitches } from '@stitches/react';
import { core, darkTheme } from '@tokens-studio/tokens';

export type CSS = StitchesCSS<typeof config>;

export const {
    css,
    theme,
    config,
    styled,
    globalCss,
    keyframes,
    getCssText,
    createTheme,
} = createStitches({
    theme: {
        colors: {
            ...darkTheme.colors,
            ...grayDark,
            ...sandDark,
            ...amberDark,
            ...crimsonDark,
            ...pinkDark,
            ...purpleDark,
            ...violetDark,
            ...indigoDark,
            ...tealDark,
            ...limeDark,
            ...mintDark,
            ...blueDark,
            ...redDark,
            ...greenDark,

        },
        shadows: darkTheme.shadows,
        ...core,
    },
});

export const StyledComponent = styled('div');
