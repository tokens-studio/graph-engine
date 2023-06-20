import { ColorModifierTypes, node } from "#/nodes/color/blend.js";
import { executeNode } from "#/core.js";

describe("color/blend", () => {
  it("darkens the color correctly", async () => {
    const output = await executeNode({
      input: {
        color: "red",
      },
      node,
      state: {
        space: "srgb",
        modifierType: ColorModifierTypes.DARKEN,
        value: 0.5,
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#800000",
    });
  });

  it("lightens the color correctly", async () => {
    const output = await executeNode({
      input: {
        color: "red",
      },
      node,
      state: {
        space: "srgb",
        modifierType: ColorModifierTypes.LIGHTEN,
        value: 0.5,
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#ff8080",
    });
  });
});
