import { BaseNode } from "./base.js";
import { Channels, IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

const ChannelLookup = {
  Red: 1,
  Green: 2,
  Blue: 4,
  Black: 8,
  Alpha: 16,
};

export class SeperateNode extends BaseNode {
  static title = "Seperate Channels";
  static type = "studio.tokens.image.seperate";

  declare inputs: ToInput<{
    image: Image;
    channel: keyof typeof ChannelLookup;
    channel: keyof typeof ChannelLookup;
  }>;

  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.dataflow.addInput("image", {
      type: ImageSchema,
    });

    this.dataflow.addInput("channel", {
      type: {
        ...StringSchema,
        enum: Object.keys(ChannelLookup),
        default: "Red",
      },
    });

    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, channel } = this.getAllInputs();

    const ch = ChannelLookup[channel];

    await ImageMagick.read(
      this.cloneImage(image),
      async (image: IMagickImage) => {
        await image.separate(ch as Channels, (collection) => {
          collection.at(0)?.write(image.format, (data) =>
            this.outputs.image.set({
              data,
            }),
          );
        });
      },
    );
  }
}
