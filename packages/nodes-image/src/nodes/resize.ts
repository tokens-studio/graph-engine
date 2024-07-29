import { BaseNode } from "./base.js";
import {
  BooleanSchema,
  INodeDefinition,
  NumberSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { IMagickImage } from "@imagemagick/magick-wasm";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

export class ResizeNode extends BaseNode {
  static title = "Resize";
  static type = "studio.tokens.image.resize";

  declare inputs: ToInput<{
    image: Image;
    width: number;
    height: number;
    asPercent: boolean;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });
    this.addInput("width", {
      type: NumberSchema,
    });
    this.addInput("height", {
      type: NumberSchema,
    });
    this.addInput("asPercent", {
      type: BooleanSchema,
    });
    this.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, width, height, asPercent } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      let targetWidth = width;
      let targetHeight = height;

      if (asPercent) {
        targetWidth = image.width * (width / 100);
        targetHeight = image.height * (height / 100);
      }
      image.resize(targetWidth, targetHeight);

      image.write((data) =>
        this.setOutput("image", {
          data,
        }),
      );
    });
  }
}
