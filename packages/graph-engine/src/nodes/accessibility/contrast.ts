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
  /**
   * Method
   */
  method?: "APCA" | "WCAG2";

  absolute?: boolean;
};

const defaults = {
  method: "WCAG2",
  absolute: false,
};

const process = (input: Inputs, state) => {
  const final = {
    ...state,
    ...input,
  };
  const textColor = new Color(final.a);
  const backgroundColor = new Color(final.b);
  let calculated;
  switch (final.method) {
    case "APCA":
      calculated = backgroundColor.contrast(textColor, "APCA");
      break;
    case "WCAG2":
      calculated = textColor.contrast(backgroundColor, "WCAG21");
      break;
    default:
      calculated = textColor.contrast(backgroundColor, "WCAG21");
  }

  return final.absolute ? Math.abs(calculated) : calculated;
};

export const node: NodeDefinition<Inputs> = {
  description: "Calculates the contrast between two colors",
  type,
  defaults,
  process,
};
