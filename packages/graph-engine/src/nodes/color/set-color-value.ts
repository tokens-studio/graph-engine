// node
/**
 * Sets a certain property on a color's value.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import Color from "colorjs.io";

export const type = NodeTypes.SET_COLOR_LUMINANCE;

type Inputs = {
  /**
   * Color
   */
  color: string;
  /**
   * Modify L
   */
  l: string;
};

export const defaults = {
  l: 0,
};

const process = (input: Inputs, state) => {
  const final = {
    ...state,
    ...input,
  };

  const { color, l } = final;

  const baseColor = new Color(color);
  const currentL = baseColor.get("lch.l");
  const returnedColor = baseColor.set("lch.l", Number(l) + currentL);
  return returnedColor.toString({ format: "hex" });
};

/**
 * @deprecated
 * This will be replaced by a new node that will be able to set any property on a color.
 */
export const node: NodeDefinition<Inputs> = {
  description: "Sets a certain property on a color's value.",
  type,
  defaults,
  process,
};
