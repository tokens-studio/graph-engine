import { CSS as StitchesCSS, createStitches } from '@stitches/react';
import { core, lightTheme } from '@tokens-studio/tokens';

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
    colors: lightTheme.colors,
    shadows: lightTheme.shadows,
    ...core,
  },
});

export const StyledComponent = styled('div');

// https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/#dynamic-viewport
export const applyGlobalCSS = globalCss({
  '.react-flow': {
    background: '$bgDefault !important',
  },
  body: { height: '100dvh', bgColor: '$bgDefault', color: '$fgDefault' },
  a: {
    textDecoration: 'none',
    color: '$buttonPrimaryBgRest',
    fontSize: '$small',
    fontWeight: '$sansMedium',
  },
  '.react-flow__node': {
    width: 'unset',
  },

  '#__next': { height: '100vh' },
});
