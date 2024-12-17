import { Graph } from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { describe, expect, test } from "vitest";
import Node from "../src/nodes/scopeByType.js";

describe("nodes/scopeByType", () => {
  test("adds color scopes to color token", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["ALL_FILLS", "STROKE_COLOR", "EFFECT_COLOR"],
        },
      },
    });
  });

  test("adds dimension scopes to dimension token", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "16px",
      type: "dimension",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: [
            "GAP",
            "WIDTH_HEIGHT",
            "CORNER_RADIUS",
            "STROKE_FLOAT",
            "EFFECT_FLOAT",
            "PARAGRAPH_INDENT",
          ],
        },
      },
    });
  });

  test("adds font-related scopes to typography tokens", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "Inter",
      type: "fontFamilies",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["FONT_FAMILY"],
        },
      },
    });
  });

  test("preserves existing extensions and merges scopes", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
      $extensions: {
        "com.figma": {
          scopes: ["TEXT_FILL"],
          otherProp: true,
        },
        "other.extension": {
          someProp: "value",
        },
      },
    } as unknown as SingleToken;

    node.inputs.token.setValue(mockToken);
    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["TEXT_FILL", "ALL_FILLS", "STROKE_COLOR", "EFFECT_COLOR"],
          otherProp: true,
        },
        "other.extension": {
          someProp: "value",
        },
      },
    });
  });
});
