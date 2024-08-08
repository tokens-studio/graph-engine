import { BaseNode } from "./base.js";
import {
  BooleanSchema,
  INodeDefinition,
  NumberSchema,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";
import type { IMagickImage } from "@imagemagick/magick-wasm";

export class ImageProperties extends BaseNode {
  static title = "Properties";
  static type = "studio.tokens.image.properties";

  declare inputs: ToInput<{
    image: Image;
  }>;
  declare outputs: ToOutput<{
    image: Image;
    width: number;
    height: number;
    channelCount: number;
    format: string;
    gamma: number;
    hasAlpha: boolean;
    quality: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.dataflow.addInput("image", {
      type: ImageSchema,
    });

    this.dataflow.addOutput("width", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("height", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("channelCount", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("format", {
      type: StringSchema,
    });
    this.dataflow.addOutput("gamma", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("hasAlpha", {
      type: BooleanSchema,
    });
    this.dataflow.addOutput("quality", {
      type: NumberSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image } = this.getAllInputs();

    //No need to clone as this is a readonly operation
    await ImageMagick.read(image.data, (image: IMagickImage) => {
      this.outputs.width.set(image.width);
      this.outputs.height.set(image.height);
      this.outputs.channelCount.set(image.channelCount);
      this.outputs.format.set(image.format);
      this.outputs.gamma.set(image.gamma);
      this.outputs.hasAlpha.set(image.hasAlpha);
      this.outputs.quality.set(image.quality);
    });
  }
}
