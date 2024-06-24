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
import type {} from '@stitches/react';

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
