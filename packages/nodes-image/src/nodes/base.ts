import { Image } from "../schemas/types.js";
import { Node } from "@tokens-studio/graph-engine";
import type { ImageMagick } from "@imagemagick/magick-wasm";

export class BaseNode extends Node {
  static annotations = {
    "engine.capability.imageMagick": true,
  };
  getImageMagick(): typeof ImageMagick {
    return this.getGraph().capabilities["imageMagick"];
  }

  cloneImage = (image: Image) => {
    const dst = new Uint8Array(image.data.byteLength);
    dst.set(new Uint8Array(image.data));
    return dst;
  };
}
