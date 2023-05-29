import { ColorModifier, ColorModifierTypes } from "@tokens-studio/types";
import { NodeDefinition, NodeTypes } from "../../types.js";
import { modifyColor } from "./lib/modifyColor.js";
import Color from "colorjs.io";

const type = NodeTypes.BLEND;

function convertModifiedColorToHex(baseColor: string, modifier: ColorModifier) {
  let returnedColor = baseColor;
  returnedColor = modifyColor(baseColor, modifier);
  const returnedColorInSpace = new Color(returnedColor);
  return returnedColorInSpace.to("srgb").toString({ format: "hex" });
}

export type BlendNodeData = {
  /**
   * Start
   */
  color: string;
  /**
   * The number for steps for the shades
   */
  modifierType: ColorModifierTypes;
  /**
   * Value to apply to the modifier
   */
  value: string;
  /**
   * Mixing color
   */
  mixColor: string;
  /**
   * The color space we are operating in
   */
  space: string;
};

export const defaults = {
  value: 0.5,
  space: "srgb",
  modifierType: ColorModifierTypes.DARKEN,
};

const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  return convertModifiedColorToHex(input.color, {
    type: final.modifierType,
    color: final.mixColor,
    space: final.space,
    value: final.value,
  } as ColorModifier);
};

export const node: NodeDefinition = {
  type,
  defaults,
  process,
};
