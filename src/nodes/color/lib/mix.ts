import { ColorSpaceTypes } from "./types.js";
import Color from "colorjs.io";

export function mix(
  color: Color,
  colorSpace: ColorSpaceTypes,
  amount: number,
  mixColor: Color
) {
  const mixValue = Math.max(0, Math.min(1, Number(amount)));

  return Color.mix(color, mixColor, mixValue) as unknown as Color;
}
