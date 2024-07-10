import { CSS as StitchesCSS, createStitches } from '@stitches/react';
import {
  amberDark,
  blueDark,
  crimsonDark,
  grayDark,
  greenDark,
  indigoDark,
  limeDark,
  mintDark,
  pinkDark,
  purpleDark,
  redDark,
  sandDark,
  tealDark,
  violetDark,
} from '@radix-ui/colors';
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
      ...core,
      ...darkTheme.colors,
      ...{
        /* Desaturated colors */
        bgCanvas: '#292929',
        bgDefault: '#2d2d2d',
        bgEmphasis: '#2b2b2b',
        bgSubtle: '#373737',
        bgSurface: '#292929',
        borderDefault: '#636363',
        borderMuted: '#2e2e2e',
        borderSubtle: '#454545',
        fgSubtle: '#8a8a8a',
        inputBg: '#202020',
        inputBorderRest: '#454545',
      },
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
  },
});

export const StyledComponent = styled('div');
