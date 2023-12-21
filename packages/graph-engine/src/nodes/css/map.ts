//@ts-ignore If this is not ignored, rollup acts stupid and tries to import this file as a module
import properties from "mdn-data/css/properties.json" assert { type: "json" };
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, ObjectSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "CSS Map";
  static type = NodeTypes.CSS_MAP;
  static description =
    "Exposes all the css properties. You can link the input of any other node to the any property that is there in the css map node.";
  constructor(props?: INodeDefinition) {
    super(props);

    const self = this;
    Object.keys(properties)
      .filter((name) => !name.startsWith("-"))
      .forEach((name) => {
        this.addInput(name, {
          type: AnySchema,
        });
      });

    this.addOutput("value", {
      type: ObjectSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    this.setOutput("value", inputs);
  }
}
