import { DataflowNode } from "@tokens-studio/graph-engine";
import { Image } from "../schemas/types.js";
import type { ImageMagick } from "@imagemagick/magick-wasm";

export class BaseNode extends DataflowNode {
  static annotations = {
    "engine.capability.imageMagick": true,
  };
  getImageMagick(): typeof ImageMagick {
    return this.getGraph().capabilities["imageMagick"];
  }

  cloneImage = (image: ImageData | Image) => {
    const dst = new Uint8Array(image.data.byteLength);
    dst.set(new Uint8Array(image.data));
    return dst;
  };
}
