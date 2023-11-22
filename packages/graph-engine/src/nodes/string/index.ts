import { node as lowercase } from "./lowercase.js";
import { node as joinString } from "./join.js";
import { node as regex } from "./regex.js";
import { node as uppercase } from "./uppercase.js";
import { node as split } from "./split.js";
import { node as stringify } from "./stringify.js";

export const nodes = [
  lowercase,
  stringify,
  joinString,
  regex,
  uppercase,
  split,
];
