import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition extends Node {
    static title = "Note";
    static type = NodeTypes.NOTE;

    static description =
        "A node that can be used to add comments.";

}
