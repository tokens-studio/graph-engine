// node
/**
 * Return the name of the color using the chroma.js library.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import namer from "color-namer";

export const type = NodeTypes.COLOR_NAME;

type Inputs = {
  /**
   * Color
   */
  color: string;
};

const process = (input: Inputs, state) => {
  const color = input.color || state.color;

  const names = namer(color, { pick: ["html"] })

  return names.html[0].name; 
};

export const node: NodeDefinition<Inputs> = {
  description:
    "Returns the name of the color",
  type,
  process,
};
