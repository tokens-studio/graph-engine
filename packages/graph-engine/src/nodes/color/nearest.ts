// nearestTokens.js
import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import Color from "colorjs.io";
import orderBy from "lodash.orderby";

export const type = NodeTypes.NEAREST_TOKENS;

export type State = {
  sourceColor: string;
  tokens: SingleToken[];
  compare: "Contrast" | "Hue" | "Lightness" | "Saturation" | "Distance";
  inverted?: boolean;
  wcag: WcagVersion;
};

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const defaults: State = {
  sourceColor: "#ffffff",
  tokens: [],
  compare: "Hue",
  inverted: false,
  wcag: WcagVersion.V3,
};

export const process = (input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const compareFunctions = {
    Contrast: (foreground, background) => {
      if (final.wcag == WcagVersion.V2) {
        return background.contrast(foreground, "WCAG21");
      } else {
        return Math.abs(background.contrast(foreground, "APCA"));
      }
    },
    Hue: (foreground, background) =>
      Math.abs(foreground.hsl[0] - background.hsl[0]),
    Lightness: (foreground, background) =>
      Math.abs(foreground.contrast(background, "Lstar")),
    Saturation: (foreground, background) =>
      Math.abs(foreground.hsl[1] - background.hsl[1]),
    Distance: (foreground, background) => foreground.deltaE(background, "2000"),
  };

  const sortedTokens = orderBy(
    final.tokens,
    [
      (token) => {
        let foreground = new Color(token.value);
        let background = new Color(final.sourceColor);

        return compareFunctions[final.compare](foreground, background);
      },
    ],
    [final.inverted ? "desc" : "asc"]
  );

  return {
    sortedTokens,
  };
};

export const mapOutput = (input, state, processed) => {
  return processed ? processed : undefined;
};

export const node: NodeDefinition<State, any> = {
  description: "Sorts Token Set by distance to Color",
  defaults,
  type,
  process,
  mapOutput,
};
