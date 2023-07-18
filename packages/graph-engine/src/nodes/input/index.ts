import { node as constant } from "./constant.js";
import { node as enumeratedConstant } from "./enumeratedConstant.js";
import { node as objectify } from "./objectify.js";
import { node as slider } from "./slider.js";
import { node as spread } from "./spread.js";
import { node as json } from "./json.js";

export const nodes = [
  constant,
  enumeratedConstant,
  objectify,
  slider,
  spread,
  json,
];
