import { node as and } from "./and.js";
import { node as compare } from "./compare.js";
import { node as ifNode } from "./if.js";
import { node as not } from "./not.js";
import { node as or } from "./or.js";
import { node as switchNode } from "./switch.js";

export const nodes = [and, compare, ifNode, not, or, switchNode];
