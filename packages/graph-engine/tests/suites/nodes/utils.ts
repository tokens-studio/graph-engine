import { Node } from "@/programmatic/node.js";

export const getAllOutputs = (node: Node) => {
  const outputs = {};
  Object.keys(node.outputs).forEach((key) => {
    outputs[key] = node.outputs[key].value;
  });
  return outputs;
};