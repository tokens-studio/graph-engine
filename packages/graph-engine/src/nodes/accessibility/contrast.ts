/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import { calcAPCA } from "apca-w3";

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

const process = (input: Inputs, state) => {
  const final = {
    ...state,
    ...input,
  };
  const calculated = calcAPCA(final.a, final.b);

  return final.absolute ? Math.abs(calculated) : calculated;
};

export const node: NodeDefinition<Inputs> = {
  description: "Calculates the contrast between two colors",
  type,
  process,
};
