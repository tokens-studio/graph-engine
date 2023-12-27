// https://www.radix-ui.com/docs/colors/getting-started/usage#stitches
import { createTheme } from '@/lib/stitches/index.ts';
import { darkTheme, lightTheme } from '@tokens-studio/tokens';

export const light = createTheme('light-theme', {
  colors: lightTheme.colors,
  shadows: lightTheme.shadows,
});

export const dark = createTheme('dark-theme', {
  colors: darkTheme.colors,
  shadows: darkTheme.shadows,
});
