import { executeNode } from "#/core.js";
import { node } from "#/nodes/math/pow.js";

describe("math/pow", () => {
  it("produces the expected input", async () => {
    const output = await executeNode({
      input: {
        base: 2,
        exponent: 3,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 8,
    });
  });
});
