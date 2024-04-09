import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, AnySchema, NumberSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Index Array";
  static type = NodeTypes.ARRAY_INDEX;
  static description = "Extracts a value from an array at a given index";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("index", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });

    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const array = this.getRawInput("array");
    const { index } = this.getAllInputs();
    //Get the value
    const calculated = array.value[index];
    //Extract the type
    //We assume that the array has a single defined item

    const type = array.value[0];
    this.setOutput("value", calculated, type);
  }
}
