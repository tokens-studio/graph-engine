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

export class CharcoalNode extends BaseNode {
  static title = "Charcoal";
  static type = "studio.tokens.image.charcoal";

  declare inputs: ToInput<{
    image: ImageData;
    width: number;
    radius: number;
    sigma: number;
    height: number;
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
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addInput("sigma", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, radius, sigma } = this.getAllInputs();

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.charcoal(radius, sigma);
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
