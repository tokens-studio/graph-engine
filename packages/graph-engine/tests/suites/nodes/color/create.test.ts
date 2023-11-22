import { executeNode } from "@/core.js";
import { node } from "@/nodes/color/create.js";

describe("color/create", () => {
  it("creates the expected color with rgb", async () => {
    const output = await executeNode({
      input: {
        space: "rgb",
        a: 255,
        b: 255,
        c: 255,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#ffffff",
    });
  });
  it("creates the expected color with rgba", async () => {
    const output = await executeNode({
      input: {
        space: "rgb",
        a: 255,
        b: 255,
        c: 255,
        //include the alpha channel
        d: 0.5,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#ffffff80",
    });
  });
  it("creates the expected color with hsl", async () => {
    const output = await executeNode({
      input: {
        space: "hsl",
        a: 0,
        b: 1,
        c: 0.5,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#ff0000",
    });
  });

  it("creates the expected color with hsv", async () => {
    const output = await executeNode({
      input: {
        space: "hsv",
        a: 88,
        b: 100,
        c: 0.9,
        d: 0.5,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "#00e60080",
    });
  });
});
