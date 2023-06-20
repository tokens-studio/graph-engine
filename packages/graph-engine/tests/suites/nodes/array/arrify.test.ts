import { executeNode } from "#/core.js";
import { node } from "#/nodes/array/arrify.js";

describe("array/arrify", () => {
  it("creates an empty array with no inputs", async () => {
    const output = await executeNode({
      input: {},
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [],
    });
  });
  it("creates an array with holes", async () => {
    const output = await executeNode({
      input: {
        "1": 0,
        "10": 1,
        11: 2,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [0, 1, 2],
    });
  });
});
