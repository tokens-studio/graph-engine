import { BaseNode } from "./base.js";
import { IMagickImage } from "@imagemagick/magick-wasm";
import { INodeDefinition, ToInput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas/index.js";

export class AutoOrient extends BaseNode {
  static title = "Auto Orient";
  static type = "studio.tokens.image.autoOrient";

  declare inputs: ToInput<{
    image: ImageData;
  }>;

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
      image.autoOrient();
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
