import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";
//@ts-ignore
import * as  cssFunctionsData from "mdn-data/css/functions.json" ;

const FUNCTION_NAMES = Object.keys(cssFunctionsData);

export default class NodeDefinition extends Node {
  static title = "CSS Function";
  static type = "studio.tokens.css.function";
  static description = "Applies a CSS function to a value.\n\nInputs: Function name, Value\nOutput: Formatted CSS function string\n\nUse this node to generate CSS function calls like 'rgb()', 'calc()', or custom functions. Select the function and provide the value to create properly formatted CSS function strings. Useful for dynamic styling, complex CSS calculations, or generating CSS values that require function syntax.";

  declare inputs: ToInput<{
    functionName: keyof typeof cssFunctionsData;
    value: string;
  }>;

  declare outputs: ToOutput<{
    value: string;
  }>;


  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("functionName", {
      type: {
        ...StringSchema,
        enum: FUNCTION_NAMES,
      },
    });
    this.addInput("value", {
      type: StringSchema,
    });
    this.addOutput("value", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const { functionName, value } = this.getAllInputs();
    this.setOutput("value", functionName.replace("()", `(${value})`));
  }
}
