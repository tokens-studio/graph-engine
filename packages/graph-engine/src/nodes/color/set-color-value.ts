// node
/**
 * Sets a certain property on a color's value.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import Color from "colorjs.io";

export const type = NodeTypes.SET_COLOR_VALUE;

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

  console.log('color', color, l);

  const baseColor = new Color(color);
  const currentL = baseColor.get('lch.l');

  const returnedColor = baseColor.set('lch.l', Number(l) + currentL);

  console.log('retc', baseColor, currentL, returnedColor);

  return returnedColor.toString({ format: "hex" });
};

export const node: NodeDefinition<Inputs> = {
  description:
    "Sets a certain property on a color's value.",
  type,
  defaults,
  process,
};