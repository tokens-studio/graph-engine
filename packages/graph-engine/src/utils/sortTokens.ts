import Color from "colorjs.io";
import orderBy from "lodash.orderby";
import { compareFunctions } from "./compareFunctions.js";

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const sortTokens = (tokens, sourceColor, compare, wcag, inverted) =>
  orderBy(
    tokens.map((token) => {
      let foreground = new Color(token.value);
      let background = new Color(sourceColor);
      let compareValue = compareFunctions[compare](
        foreground,
        background,
        wcag
      );

      return {
        ...token,
        compareValue,
      };
    }),
    ["compareValue"],
    [inverted ? "desc" : "asc"]
  );
