import { MagickReadSettings } from "@imagemagick/magick-wasm";

export type Image = {
  data: Uint8Array;
  settings?: MagickReadSettings;
};
