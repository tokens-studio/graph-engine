import { BaseNode } from "./base.js";
import {
  INodeDefinition,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import { ImageSchema } from "../schemas/index.js";
import { MagickFormat, MagickReadSettings } from "@imagemagick/magick-wasm";
import axios from "axios";

async function loadImageAsBuffer(url) {
  // Fetch the image
  const response = await axios(url, { responseType: "blob" });
  const blob = response.data;
  const arrayBuffer = await blob.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  //Attempt to lookup the format from the response data
  const format = response.headers["content-type"].split("/")[1].toUpperCase();
  let detectedFormat = MagickFormat.Unknown;

  if (MagickFormat[format]) {
    detectedFormat = MagickFormat[format];
  }

  return {
    data,
    settings: {
      format: detectedFormat,
    } as MagickReadSettings,
  };
}

export class FetchNode extends BaseNode {
  static title = "Load node";
  static type = "studio.tokens.image.load";

  declare inputs: ToInput<{
    url: string;
  }>;
  declare outputs: ToOutput<{
    image: Image;
  }>;

  static description = "Loads an image externally";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("url", {
      type: StringSchema,
    });

    this.addOutput("image", {
      type: ImageSchema,
    });
  }

  async execute() {
    const { url } = this.getAllInputs();

    const { data } = await loadImageAsBuffer(url);

    this.outputs.image.set({
      data,
      settings: new MagickReadSettings(),
    });
  }
}
