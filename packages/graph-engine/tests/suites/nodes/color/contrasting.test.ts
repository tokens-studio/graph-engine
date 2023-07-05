import { node } from "#/nodes/color/contrasting.js";
import { executeNode } from "#/core.js";

describe("color/blend", () => {
  it("should return the more contrasting color correctly with WCAG 3", async () => {
    const output = await executeNode({
      input: {
        a: "#000000",
        b: "#ffffff",
        background: "#ffffff",
        wcag: 3,
        threshold: 60
      },
      node,
      state: node.defaults,
      nodeId: "",
    });

    expect(output).toEqual({
      color: "#000000",
      sufficient: true, // assuming contrast value is above 60
      contrast: expect.any(Number)
    });
  });

  it("should return the more contrasting color correctly with WCAG 2", async () => {
    const output = await executeNode({
      input: {
        a: "#000000",
        b: "#ffffff",
        background: "#000000",
        wcag: 2,
        threshold: 4.5
      },
      node,
      state: node.defaults,
      nodeId: "",
    });

    expect(output).toEqual({
      color: "#ffffff",
      sufficient: true, // assuming contrast value is above 4.5
      contrast: expect.any(Number)
    });
  });

  it("should return false for sufficient contrast if below threshold", async () => {
    const output = await executeNode({
      input: {
        a: "#dddddd",
        b: "#bbbbbb",
        background: "#ffffff",
        wcag: 3,
        threshold: 60
      },
      node,
      state: node.defaults,
      nodeId: "",
    });

    expect(output).toEqual({
      color: "#bbbbbb",
      sufficient: false, // assuming contrast value is below 60
      contrast: 36.717456545363994
    });
  });
});
