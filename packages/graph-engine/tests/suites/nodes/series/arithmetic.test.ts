import { executeNode } from "@/core.js";
import { node } from "@/nodes/series/arithmetic.js";

describe("series/arithmetic", () => {
  it("generates the expected series", async () => {
    const output = await executeNode({
      input: {
        base: 16,
        stepsDown: 1,
        steps: 1,
        increment: 1,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      "-1": 15,
      0: 16,
      1: 17,
      asArray: [15, 16, 17],
    });
  });
});
