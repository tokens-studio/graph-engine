import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";
//@ts-ignore
import * as  cssFunctionsData from "mdn-data/css/functions.json" ;

const FUNCTION_NAMES = Object.keys(cssFunctionsData);

export default class NodeDefinition extends Node {
  static title = "CSS Function";
  static type = "studio.tokens.css.function";
  static description = "Applies a CSS function to the value";

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
