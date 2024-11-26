import { Graph } from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { describe, expect, test } from "vitest";
import Node from "../src/nodes/codeSyntax.js";

describe("nodes/codeSyntax", () => {
  test("adds code syntax to token without existing extensions", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.web.setValue("var(--test)");
    node.inputs.android.setValue("@test");
    node.inputs.ios.setValue("test");

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          hiddenFromPublishing: false,
          codeSyntax: {
            Web: "var(--test)",
            Android: "@test",
            iOS: "test",
          },
        },
      },
    });
  });

  test("preserves existing extensions and merges code syntax", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
      $extensions: {
        "com.figma": {
          codeSyntax: {
            Web: "existing",
            Android: "existing",
            iOS: "existing",
          },
          otherProp: true,
        },
      },
    } as unknown as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.web.setValue("new");
    node.inputs.android.setValue("new");

    await node.execute();

    expect(node.outputs.token.value).toEqual({
      ...mockToken,
      $extensions: {
        "com.figma": {
          hiddenFromPublishing: false,
          codeSyntax: {
            Web: "new",
            Android: "new",
            iOS: "existing",
          },
          otherProp: true,
        },
      },
    });
  });

  test("handles empty string inputs", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const mockToken = {
      name: "test",
      value: "#ff0000",
      type: "color",
    } as SingleToken;

    node.inputs.token.setValue(mockToken);
    node.inputs.web.setValue("");
    node.inputs.android.setValue("");
    node.inputs.ios.setValue("");

    await node.execute();

    expect(
      node.outputs.token.value?.$extensions?.["com.figma"]?.codeSyntax,
    ).toEqual({});
  });
});
