import { Graph } from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { describe, expect, test } from "vitest";
import Node from "../src/nodes/scopeAll.js";

describe("nodes/scopeAll", () => {
  test("adds ALL_SCOPES to token without existing scopes", async () => {
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
          scopes: ["ALL_SCOPES"],
        },
      },
    });
  });

  test("preserves existing ALL_SCOPES", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
      $extensions: {
        "com.figma": {
          scopes: ["ALL_SCOPES"],
        },
      },
    } as unknown as SingleToken;

    node.inputs.token.setValue(mockToken);
    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          scopes: ["ALL_SCOPES"],
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
          scopes: ["TEXT_FILL", "STROKE"],
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
          scopes: ["TEXT_FILL", "STROKE", "ALL_SCOPES"],
          otherProp: true,
        },
        "other.extension": {
          someProp: "value",
        },
      },
    });
  });
});
