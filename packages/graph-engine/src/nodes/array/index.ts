import { node as arrifyNode } from "./arrify.js";
import { node as concatNode } from "./concat.js";
import { node as dotPropNode } from "./dotProp.js";
import { node as indexArrayNode } from "./indexArray.js";
import { node as joinNode } from "./join.js";
import { node as reverseNode } from "./reverse.js";
import { node as sliceNode } from "./slice.js";
import { node as sortNode } from "./sort.js";
import { node as arrayPassUnitNode } from "./passUnit.js";
import { node as nameNode } from "./name.js";

export const arrayNodes = [
  arrifyNode,
  concatNode,
  dotPropNode,
  indexArrayNode,
  reverseNode,
  sliceNode,
  joinNode,
  sortNode,
  arrayPassUnitNode,
  nameNode,
];

export {
  arrifyNode,
  concatNode,
  dotPropNode,
  indexArrayNode,
  reverseNode,
  sliceNode,
  joinNode,
  sortNode,
  arrayPassUnitNode,
  nameNode as arrayNameNode,
};
