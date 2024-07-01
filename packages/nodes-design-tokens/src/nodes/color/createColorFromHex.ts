import {
  ColorSchema,
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { ReferenceSchema, TokenColorSchema } from "../../schemas/index.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Create Color Token from HEX";
  static type = "studio.tokens.design.color.createFromHex";
  static description = "Creates a color token from a HEX value";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("name", {
      type: StringSchema,
    });
    this.addInput("reference", {
      type: ReferenceSchema,
    });
    this.addInput("value", {
      type: ColorSchema,
    });
    this.addInput("description", {
      type: StringSchema,
    });

    this.addOutput("token", {
      type: TokenColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    const colorObject = new Color(props.value);
    
    this.setOutput("token", props);
  }
}
