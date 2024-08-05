import { BaseNode } from "./base.js";
import { IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  NumberSchema,
  ToInput,
} from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas/index.js";

export class VignetteNode extends BaseNode {
  static title = "Vignette";
  static type = "studio.tokens.image.vignette";

  declare inputs: ToInput<{
    image: ImageData;
    radius: number;
    sigma: number;
    x: number;
    y: number;
  }>;
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });
    this.addInput("radius", {
      type: NumberSchema,
    });
    this.addInput("sigma", {
      type: NumberSchema,
    });
    this.addInput("x", {
      type: NumberSchema,
    });
    this.addInput("y", {
      type: NumberSchema,
    });
    this.addOutput("image", {
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
