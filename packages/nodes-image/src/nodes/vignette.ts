import { BaseNode } from "./base.js";
import { IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  NumberSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

export class VignetteNode extends BaseNode {
  static title = "Vignette";
  static type = "studio.tokens.image.vignette";

  declare inputs: ToInput<{
    image: Image;
    radius: number;
    sigma: number;
    x: number;
    y: number;
  }>;

  declare outputs: ToOutput<{
    image: Image;
  }>;
  constructor(props: INodeDefinition) {
    super(props);
    const df = this.dataflow;
    df.addInput("image", {
      type: ImageSchema,
    });
    df.addInput("radius", {
      type: NumberSchema,
    });
    df.addInput("sigma", {
      type: NumberSchema,
    });
    df.addInput("x", {
      type: NumberSchema,
    });
    df.addInput("y", {
      type: NumberSchema,
    });
    df.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, radius, sigma, x, y } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.vignette(radius, sigma, x, y);
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
