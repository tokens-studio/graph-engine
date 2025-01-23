import { BaseNode } from "./base.js";
import { CompositeOperator, IMagickImage } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

//Create lookup for a string version of the enum
//Yes this is hardcoded, but we can't get the enum values from the ImageMagick library as strings
const CompositeOperatorLookup = {
  Alpha: 1,
  Atop: 2,
  Blend: 3,
  Blur: 4,
  Bumpmap: 5,
  ChangeMask: 6,
  Clear: 7,
  ColorBurn: 8,
  ColorDodge: 9,
  Colorize: 10,
  Copy: 13,
  Darken: 20,
  DarkenIntensity: 21,
  Difference: 22,
  Displace: 23,
  Dissolve: 24,
  Distort: 25,
  DstAtop: 28,
  Dst: 29,
  DstIn: 30,
  DstOut: 31,
  DstOver: 32,
  Exclusion: 33,
  HardLight: 34,
  HardMix: 35,
  Hue: 36,
  In: 37,
  Intensity: 38,
  Lighten: 39,
  LightenIntensity: 40,
  LinearBurn: 41,
  LinearDodge: 42,
  LinearLight: 43,
  Luminize: 44,
  Mathematics: 45,
  MinusDst: 46,
  MinusSrc: 47,
  Modulate: 48,
  Multiply: 51,
  No: 52,
  Out: 53,
  Over: 54,
  Overlay: 55,
  PegtopLight: 56,
  PinLight: 57,
  Plus: 58,
  Replace: 59,
  Saturate: 60,
  Screen: 61,
  SoftLight: 62,
  SrcAtop: 63,
  Src: 64,
  SrcIn: 65,
  SrcOut: 66,
  SrcOver: 67,
  Threshold: 68,
  VividLight: 69,
  Xor: 70,
  Stereo: 71,
  Freeze: 72,
  Interpolate: 73,
  Negate: 74,
  Reflect: 75,
  SoftBurn: 76,
  SoftDodge: 77,
  Stamp: 78,
  RMSE: 79,
  SaliencyBlend: 80,
  SeamlessBlend: 81,
};
export class ComposeNode extends BaseNode {
  static title = "Compose";
  static type = "studio.tokens.image.compose";

  declare inputs: ToInput<{
    a: Image;
    b: Image;
    operator: keyof typeof CompositeOperatorLookup;
  }>;

  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: ImageSchema,
    });
    this.addInput("b", {
      type: ImageSchema,
    });

    this.addInput("operator", {
      type: {
        ...StringSchema,
        enum: Object.keys(CompositeOperatorLookup),
        default: "Dissolve",
      },
    });

    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { a, b, operator } = this.getAllInputs();

    const compositeOperator = CompositeOperatorLookup[operator];

    if (!a || !b) {
      throw new Error("Missing input");
    }

    const aa = this.cloneImage(a);
    const bb = this.cloneImage(b);
    await ImageMagick.read(aa, async (image: IMagickImage) => {
      await ImageMagick.read(bb, async (bbb: IMagickImage) => {
        image.composite(bbb, compositeOperator as CompositeOperator);
      });
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
