//@ts-ignore If this is not ignored, rollup acts stupid and tries to import this file as a module
import properties from "mdn-data/css/properties.json" assert { type: "json" };
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, ObjectSchema, StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "CSS Map";
  static type = NodeTypes.CSS_MAP;
  static description =
    "Exposes all the css properties. You can link the input of any other node to the any property that is there in the css map node.";
  constructor(props?: INodeDefinition) {
    super(props);

    Object.keys(properties)
      .filter((name) => !name.startsWith("-"))
      .forEach((name) => {
        this.addInput(name, {
          type: StringSchema,
        });
      });

    this.addOutput("value", {
      type: ObjectSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    const output = Object.entries(inputs).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    this.setOutput("value", output);
  }
}
