import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema } from "@/schemas/index.js";
//@ts-ignore
import cssFunctionsData from "mdn-data/css/functions.json" assert { type: "json" };

const FUNCTION_NAMES = Object.keys(cssFunctionsData);

export default class NodeDefinition extends Node {
  static title = "CSS Function";
  static type = NodeTypes.CSS_FUNCTIONS;
  static description = "Applies a CSS function to the value";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("functionName", {
      type: {
        ...StringSchema,
        enum: FUNCTION_NAMES,
      },
      visible: true,
    });
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { functionName, value } = this.getAllInputs();
    this.setOutput("value", functionName.replace("()", `(${value})`));
  }
}
