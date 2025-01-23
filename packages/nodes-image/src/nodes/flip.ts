import { BaseNode } from "./base.js";
import { IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

export class FlipNode extends BaseNode {
  static title = "Flip Vertical";
  static type = "studio.tokens.image.flip";

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
      image.flip();
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
