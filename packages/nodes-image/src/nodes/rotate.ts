import { BaseNode } from "./base.js";
import { IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  NumberSchema,
  ToInput,
} from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas/index.js";

export class RotateNode extends BaseNode {
  static title = "Rotate";
  static type = "studio.tokens.image.rotate";

  declare inputs: ToInput<{
    image: ImageData;
    degrees: number;
  }>;
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });
    this.addInput("degrees", {
      type: NumberSchema,
    });
    this.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, degrees } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.rotate(degrees);
      image.write((data) =>
        this.outputs.image.set({
          data,
        })
      );
    });
  }
}
