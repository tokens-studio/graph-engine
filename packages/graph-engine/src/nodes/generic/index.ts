import input from "./input.js";
import passthrough from "./passthrough.js";
import output from "./output.js";
import subgraph from "./subgraph.js";
import arraySubgraph from "./arraySubgraph.js";
import panic from "./panic.js";
import constant from "./constant.js";
import objectify from "./objectify.js";
import note from "./note.js";
import objectMerge from "./objectMerge.js";

export const nodes = [
  constant,
  input,
  output,
  objectify,
  passthrough,
  subgraph,
  arraySubgraph,
  panic,
  note,
  objectMerge
];
