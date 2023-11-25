import { node as arrify } from "./arrify.js";
import { node as concat } from "./concat.js";
import { node as dotProp } from "./dotProp.js";
import { node as indexArray } from "./indexArray.js";
import { node as join } from "./join.js";
import { node as reverse } from "./reverse.js";
import { node as slice } from "./slice.js";
import { node as sort } from "./sort.js";
import { node as arrayPassUnit } from "./passUnit.js";

export const nodes = [
  arrify,
  concat,
  dotProp,
  indexArray,
  reverse,
  slice,
  join,
  sort,
  arrayPassUnit,
];
