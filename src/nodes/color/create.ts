import { NodeDefinition, NodeTypes } from "../../types.js";
import Color from "colorjs.io";

export const type = NodeTypes.CREATE_COLOR;

type ColorData = {
  a: string;
  b: string;
  c: string;
  d: string;
  space: string;
};

export const defaults = {
  space: "srgb",
  a: 1,
  b: 1,
  c: 1,
  d: 1,
};

const process = (input: ColorData, state) => {
  const final = {
    ...state,
    ...input,
  };

  const a = parseFloat(final.a);
  const b = parseFloat(final.b);
  const c = parseFloat(final.c);
  const d = parseFloat(final.d);

  const newCol = new Color(final.space, [a, b, c], isNaN(d) ? 1 : d);

  return newCol.to("srgb").toString({ format: "hex" });
};

export const node: NodeDefinition<ColorData> = {
  type,
  defaults,
  process,
};
