import { BaseNode } from "./base.js";
import { type IMagickImage, QuantizeSettings } from "@imagemagick/magick-wasm";
import {
  INodeDefinition,
  NumberSchema,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";

export const colorSpaceLookup = {
  CMY: 1,
  CMYK: 2,
  Gray: 3,
  HCL: 4,
  HCLp: 5,
  HSB: 6,
  HSI: 7,
  HSL: 8,
  HSV: 9,
  HWB: 10,
  Lab: 11,
  LCH: 12,
  LCHab: 13,
  LCHuv: 14,
  Log: 15,
  LMS: 16,
  Luv: 17,
  OHTA: 18,
  Rec601YCbCr: 19,
  Rec709YCbCr: 20,
  RGB: 21,
  scRGB: 22,
  sRGB: 23,
  Transparent: 24,
  XyY: 25,
  XYZ: 26,
  YCbCr: 27,
  YCC: 28,
  YDbDr: 29,
  YIQ: 30,
  YPbPr: 31,
  YUV: 32,
  LinearGray: 33,
};

export const ditherMethodLookup = {
  No: 0,
  Riemersma: 1,
  FloydSteinberg: 2,
};
export class Dither extends BaseNode {
  static title = "Dither";
  static type = "studio.tokens.image.dither";

  declare inputs: ToInput<{
    image: Image;
    sigma: number;
    colors: number;
    colorSpace: keyof typeof colorSpaceLookup;
    ditherMethod: keyof typeof ditherMethodLookup;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("image", {
      type: ImageSchema,
    });
    this.addInput("colors", {
      type: {
        ...NumberSchema,
        default: 32,
      },
    });

    this.addInput("colorSpace", {
      type: {
        ...StringSchema,
        enum: Object.keys(colorSpaceLookup),
        default: "RGB",
      },
    });

    this.addInput("ditherMethod", {
      type: {
        ...StringSchema,
        enum: Object.keys(ditherMethodLookup),
        default: "FloydSteinberg",
      },
    });

    this.dataflow.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const ImageMagick = this.getImageMagick();
    const { image, colors, colorSpace, ditherMethod } = this.getAllInputs();

    const opts = new QuantizeSettings();
    opts.colors = colors;
    opts.ditherMethod = ditherMethodLookup[ditherMethod];
    opts.colorSpace = colorSpaceLookup[colorSpace];

    await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
      image.quantize(opts);
      image.write((data) =>
        this.outputs.image.set({
          data,
        }),
      );
    });
  }
}
