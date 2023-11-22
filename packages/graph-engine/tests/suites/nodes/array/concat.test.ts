import { executeNode } from "@/core.js";
import { node } from "@/nodes/array/concat.js";

describe("array/concat", () => {
  it("concats the expected nodes", async () => {
    const output = await executeNode({
      input: {
        0: [1, 2, 3],
        1: [4, 5, 6],
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [1, 2, 3, 4, 5, 6],
    });
  });
});
