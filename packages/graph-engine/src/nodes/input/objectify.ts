import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, ObjectSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Objectify";
  static type = NodeTypes.OBJECTIFY;
  static description =
    "Objectify node allows you to convert multiple inputs to an object.";
  constructor(props?: INodeDefinition) {
    super(props);
    //Purely runtime inputs
    this.addOutput("value", {
      type: ObjectSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const finalType = {
      ...ObjectSchema,
      properties: {},
    };

    const { value, schema } = Object.entries(this.inputs).reduce(
      (acc, [key, input]) => {
        acc.value[key] = input.value;
        acc.schema.properties[key] = input.type;
        return acc;
      },
      {
        value: {},
        schema: finalType,
      }
    );
    this.setOutput("value", value, schema);
  }
}
