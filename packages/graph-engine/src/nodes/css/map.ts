import { NodeDefinition, NodeTypes } from "../../types.js";
const type = NodeTypes.CSS_MAP;

const defaults = {};

const process = (input) => {
  //This is just a passthrough to convert to a single object
  return input;
};

export const node: NodeDefinition = {
  type,
  defaults,
  description:
    "Exposes all the css properties. You can link the input of any other node to the any property that is there in the css map node.",
  process,
};
