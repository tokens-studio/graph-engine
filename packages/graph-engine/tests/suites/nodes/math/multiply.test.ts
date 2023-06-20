import { executeNode } from "#/core.js";
import { node } from "#/nodes/math/multiply.js";

describe("math/multiply", () => {
  it("multiplies two numbers", async () => {
    const output = await executeNode({
      input: {
        0: 1,
        1: 2,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 2,
    });
  });
  it("converts string values if detected", async () => {
    const output = await executeNode({
      input: {
        0: "1",
        1: "2.0000",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 2,
    });
  });
  it("multiplies multiple numbers with gaps", async () => {
    const output = await executeNode({
      input: {
        0: 1,
        1: 2,
        4: 5,
        10: "10.0",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 100,
    });
  });
  it("returns 0 for no inputs", async () => {
    const output = await executeNode({
      input: {},
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 1,
    });
  });
});
