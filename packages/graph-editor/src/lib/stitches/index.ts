import { CSS as StitchesCSS, createStitches } from '@stitches/react';
import { core, darkTheme } from '@tokens-studio/tokens';
import { grayDark } from '@radix-ui/colors';

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
    ...core,
    colors: {
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

        /* Graph Styles */
        pageBg: '#111111',
        nodeBg: '$bgDefault',
        nodeBorder: '#454545',
        graphBg: '#191919',
        panelBg: '$bgDefault',
      },
      ...grayDark,
    },
    shadows: darkTheme.shadows,
  },
});

export const StyledComponent = styled('div');
