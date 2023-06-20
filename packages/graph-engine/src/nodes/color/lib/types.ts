import { ColorModifierTypes } from "@tokens-studio/types";

export enum ColorSpaceTypes {
  OKLAB = "oklab",
  OKLCH = "oklch",
  LCH = "lch",
  SRGB = "srgb",
  P3 = "p3",
  HSL = "hsl",
}

interface Modifier<T extends string, V> {
  type: T;
  value: V;
}
interface ColorGenericModifier<T extends ColorModifierTypes, V>
  extends Modifier<T, V> {
  space: ColorSpaceTypes;
}

export type LightenModifier = ColorGenericModifier<
  ColorModifierTypes.LIGHTEN,
  string
>;
export type DarkenModifier = ColorGenericModifier<
  ColorModifierTypes.DARKEN,
  string
>;
export interface MixModifier
  extends ColorGenericModifier<ColorModifierTypes.MIX, string> {
  color: string;
}
export type AlphaModifier = ColorGenericModifier<
  ColorModifierTypes.ALPHA,
  string
>;

export type ColorModifier =
  | LightenModifier
  | DarkenModifier
  | MixModifier
  | AlphaModifier;
