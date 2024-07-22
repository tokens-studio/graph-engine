import { createTheme } from '@tokens-studio/graph-editor';

export const vscodeTheme = createTheme('override-theme', {
  colors: {
    bgCanvas: 'var(--vscode-editor-background)',
    bgDefault: 'var(--vscode-editor-background)',
    bgEmphasis: 'var(--vscode-editor-background)',
    bgSubtle: '#373737',
    bgSurface: '#292929',
    borderDefault: '#636363',
    borderMuted: '#2e2e2e',
    borderSubtle: '#454545',
    fgSubtle: '#8a8a8a',
    inputBg: 'var(--vscode-input-background)',
    inputBorderRest: 'var(--vscode-input-border)',
  },
});
