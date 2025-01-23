import { BaseNode } from "./base.js";
import {
  INodeDefinition,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";
import type { IMagickImage } from "@imagemagick/magick-wasm";

export class GrayscaleNode extends BaseNode {
  static title = "Grayscale";
  static type = "studio.tokens.image.grayscale";

  declare inputs: ToInput<{
    image: Image;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });

    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.grayscale();

      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
