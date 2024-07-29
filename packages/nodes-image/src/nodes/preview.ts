import { BaseNode } from "./base.js";
import { INodeDefinition, ToInput } from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

export class PreviewNode extends BaseNode {
  static title = "Preview Image";
  static type = "studio.tokens.image.preview";

  declare inputs: ToInput<{
    image: Image;
  }>;

  static description = "Applies sepia effect to an image.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });
  }

  async execute() {}
}
