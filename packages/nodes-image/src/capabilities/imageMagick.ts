import { ImageMagick, initializeImageMagick } from "@imagemagick/magick-wasm";
import { load } from "./wasmLoader.js";
import type { CapabilityFactory } from "@tokens-studio/graph-engine";
/**
 * A factory to return the ImageMagick capability
 * @returns
 */
export const ImageCapability: CapabilityFactory = {
  name: "imageMagick",
  register: async () => {
    const wasmBytes = await load("@imagemagick/magick-wasm/magick.wasm", {
      autoResolve: true,
    });
    await initializeImageMagick(wasmBytes);
    return ImageMagick;
  },
};
