import { node as andNode } from "./and.js";
import { node as compareNode } from "./compare.js";
import { node as ifNode } from "./if.js";
import { node as notNode } from "./not.js";
import { node as orNode } from "./or.js";
import { node as switchNode } from "./switch.js";

export const logicNodes = [
  andNode,
  compareNode,
  ifNode,
  notNode,
  orNode,
  switchNode,
];

export { andNode, compareNode, ifNode, notNode, orNode, switchNode };
