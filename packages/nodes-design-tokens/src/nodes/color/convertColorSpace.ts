import {
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { TokenColorSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Convert Color Space of Token";
  static type = "studio.tokens.design.color.convert";
  static description = "Convert a color token from inputs";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("token", {
      type: TokenColorSchema,
    });
    this.addInput("colorSpace", {
      type: { 
        ...StringSchema,
        default: "srgb",
      }
    });
    this.addInput("token", {
      type: TokenColorSchema,
    });

  }

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    this.setOutput("name", props.name);
  }
}
