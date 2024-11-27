import { Graph } from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { describe, expect, test } from "vitest";
import Node from "../src/nodes/scopeColor.js";

describe("nodes/scopeColor", () => {
  test("adds single scope to token", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.textFill.setValue(true);

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["TEXT_FILL"],
        },
      },
    });
  });

  test("adds multiple scopes to token", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.textFill.setValue(true);
    node.inputs.stroke.setValue(true);
    node.inputs.effects.setValue(true);

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["EFFECT_COLOR", "STROKE_COLOR", "TEXT_FILL"],
        },
      },
    });
  });

  test("preserves existing scopes and extensions", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
      $extensions: {
        "com.figma": {
          scopes: ["FRAME_FILL"],
          otherProp: true,
        },
        "other.extension": {
          someProp: "value",
        },
      },
    } as unknown as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.textFill.setValue(true);
    node.inputs.shapeFill.setValue(true);

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
          otherProp: true,
        },
        "other.extension": {
          someProp: "value",
        },
      },
    });
  });

  test("avoids duplicate scopes", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
      $extensions: {
        "com.figma": {
          scopes: ["TEXT_FILL", "STROKE_COLOR"],
        },
      },
    } as unknown as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.textFill.setValue(true);
    node.inputs.stroke.setValue(true);
    node.inputs.allFills.setValue(true);

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["TEXT_FILL", "STROKE_COLOR", "ALL_FILLS"],
        },
      },
    });
  });

  test("handles all inputs being false", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    // All boolean inputs default to false

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: [],
        },
      },
    });
  });
});
