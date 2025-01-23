import { BaseNode } from "./base.js";
import {
  INodeDefinition,
  NumberSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";
import type { IMagickImage } from "@imagemagick/magick-wasm";

export class Oilpaint extends BaseNode {
  static title = "Oilpaint";
  static type = "studio.tokens.image.oilpaint";

  declare inputs: ToInput<{
    image: ImageData;
    radius: number;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });

    this.addInput("radius", {
      type: NumberSchema,
    });

    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, radius } = this.getAllInputs();
    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.oilPaint(radius);
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
