import { BaseNode } from "./base.js";
import {
  INodeDefinition,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";
import type { IMagickImage } from "@imagemagick/magick-wasm";

export class SepiaNode extends BaseNode {
  static title = "Sepia";
  static type = "studio.tokens.image.sepia";

  declare inputs: ToInput<{
    image: Image;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  static description = "Applies sepia effect to an image.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });

    this.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.sepiaTone();
      image.write((data) =>
        this.outputs.image.set({
          data,
        })
      );
    });
  }
}
