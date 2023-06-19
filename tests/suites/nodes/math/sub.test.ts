import { executeNode } from "#/core.js";
import { node } from "#/nodes/math/subtract.js";

describe("math/sub", () => {
  it("subtracts two numbers", async () => {
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
      output: -1,
    });
  });
  it("converts string values if detected", async () => {
    const output = await executeNode({
      input: {
        0: "1",
        1: "-2.0000",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 3,
    });
  });
  it("subtracts multiple numbers with gaps", async () => {
    const output = await executeNode({
      input: {
        0: 17,
        1: 2,
        4: 5,
        10: "10.0",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 0,
    });
  });
  it("throws an error for no inputs", async () => {
    await expect(
      executeNode({
        input: {},
        node,
        state: {},
        nodeId: "testId",
      })
    ).rejects.toThrowError(
      'Validation failed for node "testId" of type "studio.tokens.math.subtract" with error "Error: Not enough inputs"'
    );
  });
});
