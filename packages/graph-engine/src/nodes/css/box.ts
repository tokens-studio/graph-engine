import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema, StringSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "CSS Box";
  static type = NodeTypes.CSS_BOX;
  static description =
    "CSS Box node allows you to generate a CSS box from 4 values";
    

  declare inputs: ToInput<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
  declare outputs: ToOutput<{
    value: string;
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("top", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("right", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("bottom", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("left", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });

    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { top, right, bottom, left } = this.getAllInputs();
    this.setOutput("value", `${top} ${right} ${bottom} ${left}`);
  }
}
