import input from "./input.js";
import passthrough from "./passthrough.js";
import output from "./output.js";
import subgraph from "./subgraph.js";
import panic from "./panic.js";
import constant from "./constant.js";
import objectify from "./objectify.js";
import note from "./note.js";
import objectMerge from "./objectMerge.js";
import time from "./time.js";

export const nodes = [
  constant,
  input,
  output,
  objectify,
  passthrough,
  subgraph,
  panic,
  note,
  objectMerge,
  time
];
