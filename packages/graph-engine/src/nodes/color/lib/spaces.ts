import Color from 'colorjs.io';

export const ColorSpaces = Object.keys(Color.spaces);
export type ColorSpace = keyof typeof Color.spaces;
