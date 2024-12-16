import { BaseNode } from "./base.js";
import { Channels, IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  StringSchema,
  ToInput,
} from "@tokens-studio/graph-engine";
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
    image: ImageData;
    channel: keyof typeof ChannelLookup;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });

    this.addInput("channel", {
      type: {
        ...StringSchema,
        enum: Object.keys(ChannelLookup),
        default: "Red",
      },
    });

    this.addOutput("image", {
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
            })
          );
        });
      }
    );
  }
}
