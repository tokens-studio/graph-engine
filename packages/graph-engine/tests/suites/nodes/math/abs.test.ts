import { executeNode } from "#/core.js";
import { node } from "#/nodes/math/abs.js";

describe("math/abs", () => {
  it("absolutes the input", async () => {
    const output = await executeNode({
      input: {
        input: -1,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 1,
    });
  });
  it("returns undefined if no input", async () => {
    const output = await executeNode({
      input: {},
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: undefined,
    });
  });
  it("returns undefined if input is undefined", async () => {
    const output = await executeNode({
      input: {
        input: undefined,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: undefined,
    });
  });
});
