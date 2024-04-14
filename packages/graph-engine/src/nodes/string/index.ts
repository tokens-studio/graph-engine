import { node as lowercaseNode } from "./lowercase.js";
import { node as joinStringNode } from "./join.js";
import { node as regexNode } from "./regex.js";
import { node as uppercaseNode } from "./uppercase.js";
import { node as splitNode } from "./split.js";
import { node as stringifyNode } from "./stringify.js";

export const stringNodes = [
  lowercaseNode,
  stringifyNode,
  joinStringNode,
  regexNode,
  uppercaseNode,
  splitNode,
];

export {
  lowercaseNode,
  stringifyNode,
  joinStringNode,
  regexNode,
  uppercaseNode,
  splitNode,
};
