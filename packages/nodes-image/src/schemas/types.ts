import { MagickReadSettings } from "@imagemagick/magick-wasm";

export type Image = {
  data: Buffer;
  settings: MagickReadSettings;
};
