import { NodeDefinition, NodeTypes } from "../../types.js";
import { calcAPCA } from "apca-w3";

const type = NodeTypes.CONTRAST;

const process = (input) => {
  return calcAPCA(input.a, input.b);
};

export const node: NodeDefinition = {
  type,
  process,
};
