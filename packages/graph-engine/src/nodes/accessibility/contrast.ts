/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import Color from "colorjs.io";

const type = NodeTypes.CONTRAST;

type Inputs = {
  /**
   * Color
   */
  a: string;
  /**
   * Color
   */
  b: string;

  absolute?: boolean;
};

const defaults = {
  a: '#000000',
  b: '#ffffff'
};

const process = (input: Inputs, state) => {
  const final = {
    ...state,
    ...input,
  };

  let color = new Color(final.a);
  let background = new Color(final.b);
  
  const calculated = background.contrast(color, "APCA");

  return final.absolute ? Math.abs(calculated) : calculated;
};

export const node: NodeDefinition<Inputs> = {
  description: "Calculates the contrast between two colors",
  type,
  defaults,
  process,
};
