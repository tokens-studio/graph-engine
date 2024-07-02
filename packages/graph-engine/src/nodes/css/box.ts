import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema, StringSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "CSS Box";
  static type = "studio.tokens.css.box";
  static description =
    "Generates a CSS box value from individual side measurements.\n\nInputs: Top, Right, Bottom, Left (all numbers)\nOutput: Formatted CSS box value string\n\nUse this node to create shorthand CSS values for properties like margin, padding, or border-width. Input values for each side to generate a properly formatted CSS string. Simplifies the process of creating consistent box model properties in your designs.";
    

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
    });
    this.addInput("right", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addInput("bottom", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addInput("left", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });

    this.addOutput("value", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const { top, right, bottom, left } = this.getAllInputs();
    this.setOutput("value", `${top} ${right} ${bottom} ${left}`);
  }
}
