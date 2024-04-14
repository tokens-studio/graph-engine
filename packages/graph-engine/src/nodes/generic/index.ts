import { node as inputNode } from "./input.js";
import { node as passthroughNode } from "./passthrough.js";
import { node as outputNode } from "./output.js";

export const genericNodes = [inputNode, outputNode, passthroughNode];

export { inputNode, outputNode, passthroughNode };
